import { useEffect, useRef, useState } from "react"
import Drawer from "../components/drower"
import { FaCopy, FaImage, FaArrowUp, FaTimes, FaQuestionCircle } from "react-icons/fa"


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const Chat = () => {

    const [base64String, setBase64String] = useState('')
    const [uploadedImages, setUploadedImages] = useState([])
    const fileInputRef = useRef(null)
    const scroll = useRef(null)
    const [messages, setMessages] = useState([
        {
            who: 'other',
            body: (
                <div className="d-flex w-75 gap-2 align-items-start mt-3 mx-auto">
                    <div className="bg-white p-2 rounded-3 w-100">
                        <h5 className="text-center">Olá! 👋</h5>
                        <p>Eu sou seu assistente de conversão de imagens. Posso te ajudar com:</p>
                        <ul>
                            <li>Converter <strong>imagens para Base64</strong> (basta enviar as imagens)</li>
                            <li>Converter <strong>Base64 para imagens</strong> (cole o código Base64)</li>
                        </ul>
                        <p>Como posso te ajudar hoje?</p>
                    </div>
                </div>
            ),
            timestamp: new Date().toISOString()
        }
    ])

    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        scrollToBottom()
    }, [messages, isProcessing])

    const addMessage = (who, content) => {
        const newMessage = {
            who,
            body: content,
            timestamp: new Date().toISOString()
        }
        setMessages(prevMessages => [...prevMessages, newMessage])
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                addSystemMessage('Texto copiado para a área de transferência!', 'success')
            })
            .catch(err => {
                addSystemMessage('Falha ao copiar: ' + err.message, 'error')
            })
    }

    const addSystemMessage = (text, type = 'info') => {
        const colors = {
            info: 'text-primary',
            success: 'text-success',
            error: 'text-danger',
            warning: 'text-warning'
        }

        addMessage('system', (
            <div className={`small text-center ${colors[type] || ''}`}>
                <FaQuestionCircle /> {text}
            </div>
        ))
    }

    const scrollToBottom = () => {
        if (scroll.current) {
            scroll.current.scrollTo({
                top: scroll.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }

    const handleBase64Submit = async (e) => {

        e.preventDefault()
        if (isProcessing) return

        setIsProcessing(true)
        setError(null)

        scrollToBottom()

        try {

            await delay(2000)

            scrollToBottom()

            if (uploadedImages.length > 0) {
                addMessage('me', (
                    <div className="d-flex gap-2 justify-content-end align-items-start" key={Date.now()}>
                        <div className="d-flex flex-column align-items-end gap-2">
                            <div className="d-flex flex-wrap gap-2">
                                {uploadedImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(img)}
                                        alt="Uploaded preview"
                                        className="message-image rounded-4"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    />
                                ))}
                            </div>
                            <small>{uploadedImages.length} imagem(s) selecionada(s)</small>
                        </div>
                        <img src="/user.png" className="rounded-circle logo" alt="User" />
                    </div>
                ))

                // Processar todas as imagens
                const base64Results = []
                for (const img of uploadedImages) {
                    const base64 = await imageToBase64(img)
                    base64Results.push(base64)
                }

                // Mensagem inteligente do "other"
                addMessage('other', (
                    <div className="d-flex gap-2 align-items-start" key={Date.now() + 1}>
                        <img src="/logo.png" className="rounded-circle logo" alt="Logo" />
                        <div className="bg-white p-2 rounded-3 w-100">
                            <div className="mb-3">
                                <h5>Conversão concluída! ✅</h5>
                                <p>Converti {uploadedImages.length} imagem(s) para Base64 com sucesso.</p>
                                <div className="alert alert-info small">
                                    <strong>Dica:</strong> Você pode copiar todas as strings de uma vez ou individualmente abaixo.
                                </div>
                                <button
                                    onClick={() => copyToClipboard(base64Results.join('\n\n'))}
                                    className="btn btn-sm btn-outline-primary mb-2"
                                >
                                    <FaCopy /> Copiar Todas as {uploadedImages.length} Imagens
                                </button>
                            </div>

                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                {base64Results.map((base64, index) => (
                                    <div key={index} className="mb-3 p-2 border-bottom">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">Imagem {index + 1} ({Math.round(base64.length / 1024)} KB)</small>
                                            <button
                                                onClick={() => copyToClipboard(base64)}
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                <FaCopy /> Copiar
                                            </button>
                                        </div>
                                        <p className="mb-1 text-break small">{base64.substring(0, 150)}...</p>
                                        <img
                                            src={base64}
                                            alt={`Preview ${index + 1}`}
                                            className="img-thumbnail mt-2"
                                            style={{ maxWidth: '150px', maxHeight: '150px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))

                setUploadedImages([])
                addSystemMessage(`As ${uploadedImages.length} imagens foram convertidas com sucesso!`, 'success')
            }
            else if (base64String.trim()) {
                // Mensagem do usuário (texto Base64)
                addMessage('me', (
                    <div className="d-flex gap-2 justify-content-end align-items-start" key={Date.now()}>
                        <div className="d-flex flex-column align-items-end">
                            <div className="bg-white p-2 rounded-3">
                                <p className="mb-1 text-break">{base64String.substring(0, 300)}...</p>
                            </div>
                            <small className="text-muted">String Base64 ({Math.round(base64String.length / 1024)} KB)</small>
                        </div>
                        <img src="/user.png" className="rounded-circle logo" alt="User" />
                    </div>
                ))

                if (base64String.startsWith('data:image')) {
                    // Resposta inteligente para Base64 de imagem
                    addMessage('other', (
                        <div className="d-flex gap-2 align-items-start" key={Date.now() + 1}>
                            <img src="/logo.png" className="rounded-circle logo" alt="Logo" />
                            <div className="bg-white p-2 rounded-3 w-100">
                                <h5>Conversão concluída! 🎉</h5>
                                <p>Identifiquei que você enviou um código Base64 de imagem. Aqui está a visualização:</p>

                                <div className="mb-3">
                                    <img src={base64String} alt="Pré-visualização da imagem convertida" className="message-image rounded-4 img-thumbnail" style={{ maxWidth: '400px', maxHeight: '400px' }} />
                                </div>

                                <div className="alert alert-info small">
                                    <strong>Dica:</strong> Clique com o botão direito na imagem acima e selecione "Salvar imagem como..." para baixá-la.
                                </div>

                                <button onClick={() => copyToClipboard(base64String)} className="btn btn-sm btn-outline-info"><FaCopy /> Copiar Base64 Novamente</button>

                            </div>
                        </div>
                    ))

                    addSystemMessage('Base64 convertido para imagem com sucesso!', 'success')
                } else {

                    addMessage('other', (
                        <div className="d-flex gap-2 align-items-start" key={Date.now() + 1}>
                            <img src="/logo.png" className="rounded-circle logo" alt="Logo" />
                            <div className="bg-white p-2 rounded-3 w-100">
                                <h5>Ops! 🤔</h5>
                                <p>Você enviou um código Base64, mas não consegui identificar como uma imagem.</p>
                                <p>Verifique se o código começa com <code>data:image/</code> seguido do tipo (como jpeg, png, etc).</p>
                                <div className="alert alert-warning small">
                                    <strong>Exemplo válido:</strong> data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
                                </div>
                                <p>Se precisar de ajuda, posso te guiar no processo!</p>
                            </div>
                        </div>
                    ))

                    addSystemMessage('O Base64 fornecido não parece ser de uma imagem.', 'warning')
                }

                setBase64String('')
            } else {
                setError('Por favor, insira uma string Base64 ou carregue imagens.')
                addSystemMessage('Por favor, envie imagens ou um código Base64 para que eu possa ajudar.', 'warning')
            }

        } catch (err) {
            setError('Erro ao processar: ' + err.message)
            addSystemMessage('Ocorreu um erro ao processar sua solicitação: ' + err.message, 'error')
            console.error(err)
        } finally {
            setIsProcessing(false)
            scrollToBottom()
        }
    }

    const imageToBase64 = (file) => {
        scrollToBottom()

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
            reader.readAsDataURL(file)
        })
    }

    const handleImageUpload = (event) => {

        const files = Array.from(event.target.files)
        if (!files || files.length === 0) return

        const imageFiles = files.filter(file => file.type.match('image.*'))

        if (imageFiles.length === 0) {
            setError('Por favor, selecione apenas arquivos de imagem.')
            addSystemMessage('Por favor, selecione apenas arquivos de imagem (JPEG, PNG, etc).', 'error')
            return
        }

        const filesToAdd = imageFiles.slice(0, 50 - uploadedImages.length)

        if (filesToAdd.length < files.length) {
            setError(`Você pode carregar no máximo 50 imagens. ${filesToAdd.length} imagens adicionadas.`)
            addSystemMessage(`Limite de 50 imagens. ${filesToAdd.length} imagens adicionadas.`, 'warning')
        } else {
            setError(null)
        }

        setUploadedImages(prev => [...prev, ...filesToAdd])
        event.target.value = ''

        if (filesToAdd.length > 0) {
            addSystemMessage(`${filesToAdd.length} imagem(s) carregada(s) com sucesso! Pronto para converter.`, 'success')
        }
    }

    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index))
        addSystemMessage('Imagem removida da seleção.', 'info')
    }

    return (
        <div className="d-flex gap-3">
            <Drawer />
            <div className="w-75 mx-auto p-2 d-flex flex-column" style={{ height: '100vh' }}>
                <div className="p-2 w-100 flex-grow-1 overflow-auto" ref={scroll}>
                    {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message, index) => (
                        <div className={message.who === 'me' ? "d-flex justify-content-end mb-2" : message.who === 'system' ? "mb-1" : "mb-2"} key={index}>
                            {message.body}
                        </div>
                    ))}

                    {isProcessing &&
                        (
                            <div onClick={scrollToBottom()} className="d-flex gap-2 mb-4">
                                <img src="/logo.png" className="rounded-circle logo" alt="Logo" />
                                <div className="bg-light p-3 rounded-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="spinner-border spinner-border-sm text-info" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                        <span>
                                            {uploadedImages.length > 0 ? `Processando ${uploadedImages.length} imagem(s)...` : 'Analisando o código Base64...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            
                <div className="mb-2 bg-white justify-content-between p-2 rounded-4 w-100 border border-2 border-info mx-auto shadow">
                    {uploadedImages.length > 0 && (
                        <div className="mb-2">
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {uploadedImages.map((img, index) => (
                                    <div key={index} className="position-relative">
                                        <img src={URL.createObjectURL(img)} alt="Pré-visualização" style={{ height: '50px', width: '50px', objectFit: 'cover' }} className="rounded-2" />
                                        <button onClick={() => removeImage(index)} className="btn btn-sm btn-danger p-1 btn-close position-absolute top-0 start-100 translate-middle border border-light rounded-circle" style={{ width: '5px', height: '5px', borderRadius: '50%' }}></button>
                                        <small className="position-absolute bottom-0 start-50 translate-middle-x bg-dark text-white px-1 rounded">{index + 1}</small>
                                    </div>
                                ))}
                            </div>
                            <small className="text-muted">{uploadedImages.length} imagem(s) selecionada(s) - {50 - uploadedImages.length} restantes</small>
                        </div>
                    )}

                    <textarea value={base64String} onChange={(e) => { setBase64String(e.target.value); setError(null) }} className="form-control border-white text w-100" placeholder="Cole seu Base64 ou envie imagens..." rows="2" />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        {error && (<p className="text-start fw-bold text-danger mb-0">{error}</p>)}
                        <div className="ms-auto">
                            <input className='visually-hidden' type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />
                            <button onClick={() => fileInputRef.current.click()} className="btn btn-outline-info rounded-circle me-2" type="button" disabled={isProcessing || uploadedImages.length >= 50} title="Enviar imagens (máx. 50)"><FaImage /></button>
                            <button onClick={handleBase64Submit} className="btn btn-info text-white rounded-circle" type="button" disabled={isProcessing || (uploadedImages.length === 0 && !base64String.trim())}><FaArrowUp /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat