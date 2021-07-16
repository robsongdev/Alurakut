import React from 'react'
import {useRouter} from 'next/router'
import nookies from 'nookies'

export default function LoginScreen() {
    const router = useRouter()
    const [githubUser, setGithubUser] = React.useState('')

    return (
        <main style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <div className= "loginScreen" >
                <section className="logoArea">
                    <img src="https://alurakut.vercel.app/logo.svg" />

                    <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instataneas</p>
                    <p><strong>Conheça</strong> novas pessoas atraves de amigos de seus amigos e comunidades</p>
                    <p><strong>Compartilhe</strong> seus videos, fotos e paixões em um so lugar</p>
                </section>

                <section className="formArea">
                    <form className="box" onSubmit={(e)=>{
                        e.preventDefault();
                        //console.log('Usuario:', githubUser)              
                        fetch('https://alurakut.vercel.app/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({githubUser: githubUser})
                        })
                        .then(async (respostaServidor)=>{
                            const dadosDaresposta = await respostaServidor.json()
                            const token = dadosDaresposta.token
                            nookies.set(null, 'USER_TOKEN', token, {
                                path: '/',
                                maxAge: 86400 * 7
                            })
                            router.push('/')
                        })
                    }
                        
                    }>
                        <p>
                            Acesse agora mesmo com seu usuario do <strong>Github</strong>
                        </p>
                        <input 
                            placeholder="Usuario" 
                            value={githubUser} 
                            onChange={(e)=>{setGithubUser(e.target.value)}}
                        />
                        <button type="submit" >
                            Login
                        </button>
                    </form>

                    <footer className="box">
                        <p>
                            Ainda não é membro? <br/>
                            <a href="/login">
                                <strong>ENTRAR JÁ</strong>
                            </a>
                        </p>
                    </footer>
                </section>
                <footer className="footerArea">
                    <p>
                        @ 2021 alura.com.br <a href= "/">Sobre o Orkut.br</a> - <a href= "/">Centro de Segurança</a> - <a href= "/">Privacidade</a> - <a href= "/">Termos</a> - <a href= "/">Contatos</a>
                    </p>
                </footer>
                
            </div>

        </main>
    )
}