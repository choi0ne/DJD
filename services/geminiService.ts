import { GoogleGenAI } from '@google/genai';

interface WhisperResponse {
    text?: string;
    error?: {
        message: string;
    };
}

export async function transcribeWithWhisper(apiKey: string, audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    // The filename is required by the Whisper API.
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ko'); // Specify Korean for better accuracy

    let response: Response;
    try {
        response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
        });
    } catch (e) {
        throw new Error(`Whisper API 네트워크 오류: ${(e as Error).message}`);
    }
    
    let data: WhisperResponse;
    try {
        data = await response.json();
    } catch (e) {
        const textResponse = await response.text();
        throw new Error(`Whisper API 응답 파싱 실패: ${textResponse}`);
    }

    if (!response.ok) {
        throw new Error(data?.error?.message || 'Whisper API 요청 실패');
    }

    return data?.text ?? '';
}


const SYSTEM_INSTRUCTION = `당신은 한의원 진료를 돕는 AI 어시스턴트입니다. 당신의 임무는 녹음된 진료 대화 전사문을 바탕으로 구조화된 SOAP 차트를 작성하는 것입니다.

──────────────────────────────
📋 작동 목표
──────────────────────
1️⃣  제공된 전사문을 한의과 SOAP 형식에 맞춰 정리합니다.
2️⃣  전사문에 있는 내용만 사용해야 하며, 절대 내용을 지어내거나 추론하지 않습니다.
3️⃣  숫자, 경혈명, 용량, 횟수 등은 원문 그대로 유지합니다.
4️⃣  전사문에서 특정 정보를 찾을 수 없는 경우, 해당 항목은 "미확인"으로 표시합니다.
5️⃣  차트 마지막에는 주치의가 검토하기 쉽도록 요약(50자 내외)과 확인사항 체크리스트를 추가합니다. 체크리스트 3개 항목은 대화 내용에 따라 '고지' 또는 '미고지'로 정확하게 표시해야 합니다.

──────────────────
📋 출력 형식 규칙
──────────────────
- 제공된 SOAP 출력 형식을 엄격하게 준수합니다.
- 깔끔하고 간결한 언어를 사용합니다.
- 실수 가능성이 있는 중요한 수치는 굵은 글씨로 강조합니다(예: **5분**, **3장**).
- 환자명은 대화에서 유추하여 기입하고, 유추가 불가능하면 '미확인'으로 남겨둡니다.
`;

const formatKST = (d: Date) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(d);


const getUserPrompt = (transcript: string, consultationDate: Date): string => `
아래의 출력 형식과 진료 대화 내용을 바탕으로 SOAP 차트를 작성해 주세요.

[출력 형식]
환자명: [환자명]
진료일시: ${formatKST(consultationDate)}

S (주관적)
- 주호소:
- 현병력:
- 악화·완화 요인:
- 관련 증상:
- 기타:

O (객관적)
- 시진:
- 촉진/압통:
- ROM/기능검사:
- 특수검사:
- 활력징후:
- 기타:

A (평가)
- 진단명/의증:

P (계획)
- 시술:
- 치료 빈도/기간:
- 한약:
- 예후:
- 주의사항/금기:
- 생활지도/재활:
- 추적계획:

청구 태그:

🩵 요약
- [진료내용을 50자 내외 요약]

✅확인사항 (체크리스트)
1. 주소증에 대해서 정확하게 진찰했는가?: [고지/미고지]
2. 예후 및 주의사항이 누락되지 않았는가?: [고지/미고지]
3. 치료계획이 환자에게 충분히 설명되었는가?: [고지/미고지]

---

[진료 대화 내용]
${transcript}
`;


export async function generateSoapChart(geminiApiKey: string | undefined, transcript: string, consultationDate: Date): Promise<string> {
    if (!geminiApiKey) {
        throw new Error('Gemini API 키가 없습니다.');
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: getUserPrompt(transcript, consultationDate),
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        });
        return response.text ?? '';
    } catch (e) {
        throw new Error(`Gemini 생성 실패: ${(e as Error).message}`);
    }
}