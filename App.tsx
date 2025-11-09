import React, { useState, useRef, useCallback, useEffect } from 'react';
import { transcribeWithWhisper, generateSoapChart } from './services/geminiService.ts';
import { 
    MicrophoneIcon, 
    StopIcon, 
    CopyIcon, 
    SaveIcon, 
    Spinner,
    SettingsIcon,
    GeminiIcon,
    CloseIcon,
    DjdLogoIcon,
    OpenAIIcon,
    EditIcon,
    CheckIcon
} from './components/icons.tsx';

interface Settings {
    openaiKey: string;
    geminiKey: string;
}

const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: Settings) => void;
    currentSettings: Settings;
}) => {
    const [openaiKey, setOpenaiKey] = useState(currentSettings.openaiKey);
    const [geminiKey, setGeminiKey] = useState(currentSettings.geminiKey);

    useEffect(() => {
        setOpenaiKey(currentSettings.openaiKey);
        setGeminiKey(currentSettings.geminiKey);
    }, [currentSettings, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ openaiKey, geminiKey });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <SettingsIcon className="w-6 h-6 mr-3" />
                        설정
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-brand-primary mb-3 flex items-center">
                            <OpenAIIcon className="w-5 h-5 mr-2" />
                            OpenAI API (Whisper)
                        </h3>
                        <label htmlFor="openai-key" className="block text-sm font-medium text-gray-300 mb-1">API Key (음성인식용)</label>
                        <input
                            id="openai-key"
                            type="password"
                            value={openaiKey}
                            onChange={(e) => setOpenaiKey(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="OpenAI API 키를 입력하세요"
                        />
                         <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-brand-accent mt-1">
                            API 키 발급받기
                        </a>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-brand-primary mb-3 flex items-center">
                            <GeminiIcon className="w-5 h-5 mr-2" />
                            Google Gemini API
                        </h3>
                        <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-300 mb-1">API Key (차트생성용)</label>
                        <input
                            id="gemini-key"
                            type="password"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="Google Gemini API 키를 입력하세요"
                        />
                         <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-brand-accent mt-1">
                            API 키 발급받기
                        </a>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [soapChart, setSoapChart] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('openaiApiKey') || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!openaiApiKey || !geminiApiKey) {
      setIsSettingsOpen(true);
    }
  }, [openaiApiKey, geminiApiKey]);
  
  const handleToggleRecording = useCallback(async () => {
    if (!openaiApiKey || !geminiApiKey) {
      setError('OpenAI 및 Gemini API 키가 모두 설정되어야 합니다. 설정 메뉴에서 키를 입력해주세요.');
      setIsSettingsOpen(true);
      return;
    }
    
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setStatusMessage('녹음 중지. 처리 중...');
      setIsGenerating(true);
      setError(null);
    } else {
      // Start recording
      setError(null);
      setSoapChart('');
      setTranscript('');
      setIsEditing(false);
      setStatusMessage('마이크 초기화 중...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recordingStartTimeRef.current = new Date();
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const startTime = recordingStartTimeRef.current || new Date();

            // --- Stage 1: Transcription ---
            let transcriptText = '';
            try {
                setStatusMessage('오디오 전사 중...');
                transcriptText = await transcribeWithWhisper(openaiApiKey, audioBlob);
                setTranscript(transcriptText);
            } catch (err) {
                if (err instanceof Error) {
                    const lowerCaseMessage = err.message.toLowerCase();
                    if (lowerCaseMessage.includes('quota')) {
                        setError(
                            <>
                                음성 전사 실패: OpenAI API 할당량을 초과했습니다. <br />
                                <a 
                                    href="https://platform.openai.com/account/billing/overview" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="underline text-brand-accent hover:text-yellow-400"
                                >
                                    OpenAI 대시보드에서 결제 정보를 확인해주세요.
                                </a>
                            </>
                        );
                    } else if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('api_key')) {
                        setError(
                            <>
                                음성 전사 실패: API 키가 잘못되었을 수 있습니다. <br />
                                설정 메뉴에서 OpenAI API 키를 확인해주세요.
                            </>
                        );
                    } else {
                        setError(`음성 전사 실패: ${err.message}`);
                    }
                } else {
                    setError('음성 전사 실패: 알 수 없는 오류가 발생했습니다.');
                }
                console.error(err);
                setIsGenerating(false);
                setStatusMessage('');
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            if (transcriptText.trim().length === 0) {
                setSoapChart('');
                setStatusMessage('음성이 감지되지 않았습니다.');
                setIsGenerating(false);
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            // --- Stage 2: SOAP Chart Generation ---
            try {
                setStatusMessage('전사 완료. SOAP 차트 생성 중...');
                const generatedChart = await generateSoapChart(geminiApiKey, transcriptText, startTime);
                setSoapChart(generatedChart);
                setIsEditing(false);
                setStatusMessage(''); // Clear status on success
            } catch (err) {
                if (err instanceof Error) {
                    const lowerCaseMessage = err.message.toLowerCase();
                    if (lowerCaseMessage.includes('api key')) {
                         setError(
                            <>
                                SOAP 차트 생성 실패: API 키가 잘못되었을 수 있습니다. <br />
                                설정 메뉴에서 Gemini API 키를 확인해주세요.
                            </>
                        );
                    } else {
                        setError(
                            <>
                              SOAP 차트 생성에 실패했습니다. <br />
                              AI 모델 서비스에 문제가 있을 수 있습니다. 잠시 후 다시 시도해주세요.
                            </>
                        );
                    }
                } else {
                    setError('SOAP 차트 생성 실패: 알 수 없는 오류가 발생했습니다.');
                }
                console.error(err);
            } finally {
                setIsGenerating(false);
                stream.getTracks().forEach(track => track.stop());
            }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setStatusMessage('녹음 중... 완료되면 중지 버튼을 클릭하세요.');

      } catch (err) {
        let specificMessage = '알 수 없는 오류가 발생했습니다.';
        if (err instanceof Error) {
            switch (err.name) {
                case 'NotAllowedError':
                    specificMessage = '마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.';
                    break;
                case 'NotFoundError':
                    specificMessage = '사용 가능한 마이크를 찾을 수 없습니다.';
                    break;
                case 'SecurityError':
                    specificMessage = '마이크 기능은 보안(HTTPS) 연결에서만 사용할 수 있습니다.';
                    break;
                case 'NotReadableError':
                    specificMessage = '하드웨어 오류로 인해 마이크를 읽을 수 없습니다.';
                    break;
                default:
                    specificMessage = err.message;
                    break;
            }
        }
        const errorMessage = err instanceof Error ? specificMessage : 'An unknown error occurred.';
        setError(`녹음 시작 실패: ${errorMessage}`);
        console.error(err);
        setStatusMessage('녹음을 시작할 수 없습니다. 권한 및 연결을 확인하세요.');
      }
    }
  }, [isRecording, openaiApiKey, geminiApiKey]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(soapChart)
      .then(() => alert('SOAP 차트가 클립보드에 복사되었습니다!'))
      .catch(() => alert('텍스트 복사에 실패했습니다.'));
  };

  const generateFilename = (extension: 'txt'): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timestamp = `${year}${month}${day}_${hours}${minutes}`;
    
    const match = soapChart.match(/환자명:\s*(.*)/);
    const patientNameRaw = match && match[1] ? match[1].trim() : '미확인';
    // Remove brackets if they exist
    let patientName = (patientNameRaw.replace(/^\[(.*)\]$/, '$1').trim()) || '미확인';
    // Sanitize for filename
    patientName = patientName.replace(/[\\?%*:"|<>./]/g, '_');
    
    return `SOAP차트_${timestamp}_${patientName}.${extension}`;
  };
  
  const saveAsTextFile = () => {
    const filename = generateFilename('txt');
    const blob = new Blob([soapChart], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSoapChart = (chartText: string) => {
    // Add line breaks for display
    const formattedText = chartText.replace(/\n/g, '<br />');
    // Apply bold styling
    const htmlText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-accent">$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  };
  
  const handleSaveSettings = (settings: Settings) => {
    localStorage.setItem('openaiApiKey', settings.openaiKey);
    setOpenaiApiKey(settings.openaiKey);
    localStorage.setItem('geminiApiKey', settings.geminiKey);
    setGeminiApiKey(settings.geminiKey);
    setIsSettingsOpen(false);
    alert('설정이 저장되었습니다.');
  };
  
  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
      <header className="w-full max-w-7xl flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-x-3 sm:gap-x-4">
                <DjdLogoIcon className="h-9 sm:h-10 w-auto" />
                <span className="whitespace-nowrap">동제당 차트 작성 도우미</span>
            </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="설정"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <button 
            onClick={handleToggleRecording}
            disabled={isGenerating}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg
              ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-primary hover:bg-brand-secondary'}
              ${isGenerating ? 'bg-gray-500 cursor-not-allowed' : ''}
            `}
            aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
          >
            {isGenerating ? <Spinner className="w-10 h-10 text-white" /> : (
              isRecording ? <StopIcon className="w-10 h-10 text-white" /> : <MicrophoneIcon className="w-10 h-10 text-white" />
            )}
          </button>
          <p className="mt-4 text-gray-300 text-center h-5">{statusMessage || '진료 녹음을 시작하세요.'}</p>
          {error && <p className="mt-2 text-red-400 text-center">{error}</p>}
        </div>

        <div className="w-full flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transcription Panel */}
          {!isEditing && (
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-white">전사 내용</h2>
              <div className="flex-grow bg-gray-900 rounded-md p-4 overflow-y-auto text-gray-300 whitespace-pre-wrap">
                {transcript ? transcript : (
                  <span className="text-gray-500">
                    {isRecording ? '녹음 중... 완료 후 여기에 대화 내용이 표시됩니다.' : '녹음이 시작되면 여기에 대화 내용이 표시됩니다.'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* SOAP Chart Panel */}
          <div className={`bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col ${isEditing && 'lg:col-span-2'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">SOAP 차트</h2>
              {soapChart && !isGenerating && (
                <div className="flex items-center space-x-2">
                   <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Gemini 열기">
                    <GeminiIcon className="w-5 h-5" />
                  </a>
                  <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="ChatGPT 열기">
                    <OpenAIIcon className="w-5 h-5" />
                  </a>
                  <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label={isEditing ? '수정 완료' : '수정'}>
                    {isEditing ? <CheckIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                  </button>
                  <button onClick={copyToClipboard} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="클립보드에 복사">
                    <CopyIcon className="w-5 h-5" />
                  </button>
                  <button onClick={saveAsTextFile} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="텍스트 파일로 저장">
                    <SaveIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-grow bg-gray-900 rounded-md p-4 overflow-y-auto text-gray-300">
              {isEditing ? (
                <textarea
                  value={soapChart}
                  onChange={(e) => setSoapChart(e.target.value)}
                  className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none"
                  spellCheck="false"
                />
              ) : soapChart ? (
                renderSoapChart(soapChart)
              ) : (
                <span className="text-gray-500">
                  {isGenerating ? 'SOAP 차트 생성 중...' : '녹음이 완료되면 여기에 SOAP 차트가 표시됩니다.'}
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
        currentSettings={{ openaiKey: openaiApiKey, geminiKey: geminiApiKey }}
      />
    </div>
  );
};

// Fix: Add default export for the App component.
export default App;