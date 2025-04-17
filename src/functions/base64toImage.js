const handleBase64Submit = (e,  setError, base64String, setMessages,  setBase64String) => {

    e.preventDefault()
    if (!base64String) {
        setError('Por favor, insira uma string Base64 válida.')
        return
    }

    try {

        if (!base64String.startsWith('data:image')) {
            setError('A string Base64 deve começar com "data:image"')
            return
        }

        setError(null)

        setBase64String('')
    } catch (err) {
        setError('Erro ao converter Base64 para imagem.')
        console.error(err)
    }
}

export default handleBase64Submit