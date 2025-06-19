import { useChat } from '@ai-sdk/react'

const getButtonLabel = (isLoading: boolean) => {
  if (isLoading) {
    return '전송 중...'
  }

  return '전송'
}

const getMessageStyles = (role: string) => {
  const baseStyles = 'max-w-[80%] p-4 rounded-lg mb-4'

  if (role === 'user') {
    return `${baseStyles} bg-blue-500 text-white ml-auto`
  }

  if (role === 'assistant') {
    return `${baseStyles} bg-gray-100 text-gray-800 mr-auto border border-gray-200`
  }

  return `${baseStyles} bg-green-50 text-green-800 mx-auto text-center border border-green-200`
}

const ChatTest = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: 'https://s92t9ee2c1.execute-api.ap-northeast-2.amazonaws.com/med/chat/stream'
    })

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">의료 상담 AI</h1>
        <p className="text-blue-100 text-sm">
          건강 관련 질문을 자유롭게 해주세요
        </p>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="flex">
            <div className={getMessageStyles(message.role)}>
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              {message.role === 'assistant' && (
                <div className="text-xs text-gray-500 mt-2">AI 의료 상담사</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="bg-gray-100 p-4 rounded-lg border border-gray-200
                max-w-[80%]"
            >
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce
                      delay-100"
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce
                      delay-200"
                  ></div>
                </div>
                <span className="text-gray-600 text-sm">분석 중...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="증상을 설명해주세요..."
            disabled={isLoading}
            className="flex-1 p-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent disabled:bg-gray-100
              disabled:cursor-not-allowed text-black"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400
              disabled:cursor-not-allowed transition-colors duration-200
              font-medium"
          >
            {getButtonLabel(isLoading)}
          </button>
        </form>

        <div className="mt-2 text-xs text-gray-500 text-center">
          ⚠️ 이 서비스는 의학적 조언을 제공하지 않습니다. 응급상황 시 즉시
          의료진에게 연락하세요.
        </div>
      </div>
    </div>
  )
}

export default ChatTest
