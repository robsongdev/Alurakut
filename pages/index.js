import React from 'react'
import jwt from 'jsonwebtoken'
import nookies from 'nookies'
import {useRouter} from 'next/router'
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from "../src/lib/AlurakutCommons"
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSideBar(propriedades){
  return(
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px'}}/>
      <hr/>
      <p>

        <a className='boxLink' href={`http://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
  
      </p>
      <hr/>

      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title}({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual)=>{
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.login}.png`}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const githubUser = props.githubUser
  const [comunidades, setComunidades] = React.useState([{
    id:'1234',
    title:'Eu odeio acordar cedo',
    image:'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }])
  const pessoasFavoritas = ['juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho']
  
  const [seguidores, setSguidores] = React.useState([])
  React.useEffect(function(){

    //0 - Pegar array de dados do Github
    fetch(`https://api.github.com/users/${githubUser}/following`)
    .then(function(respostaDoServidor) {
      return respostaDoServidor.json()
    })
    .then(function(respostaCompleta){
      setSguidores(respostaCompleta)
    })

    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '19a2141ac7b5d822f7b41715dc01e7',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({"query": `query {
        allCommunities{
          title
          id
          imageUrl
        }
      }`})
    })
    .then((response)=> response.json())
    .then((responseCompleta) => {
      const comunidadesVindasDoDato = responseCompleta.data.allCommunities
      // console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
  },[])


  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea'}}>
          <ProfileSideBar githubUser={githubUser}/>
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea'}}>
          <Box >
            <h1 className="title">
              Bem Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault()
              const dadosDoForm = new FormData(e.target)
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async(response)=>{
                const dados = await response.json();
                const comunidade = dados.registroCriado;
                setComunidades([...comunidades, comunidade])
              })


            }}>
              <div>
                <input 
                  placeholder='Qual vai ser o nome da sua comunidade?' 
                  name='title' 
                  aria-label='Qual vai ser o nome da sua comunidade?' 
                  type='text'
                />
              </div>
              <div>
              <input 
                  placeholder='Coloque uma url para usar de capa' 
                  name='image' 
                  aria-label='Coloque uma url para usar de capa' 
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea'}}>

          <ProfileRelationsBox title="Seguindo" items={seguidores}/>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                Comunidades({comunidades.length})
            </h2>
            <ul>
                {comunidades.slice(0, 6).map((itemAtual)=>{
                  return (
                    <li key={itemAtual.id}>
                      <a href={`/comunidades/${itemAtual.id}`} >
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                  
                })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pesoas da Comunidade({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.slice(0, 6).map((itemAtual)=>{
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}  >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps (context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta)=> resposta.json())
  
  if(!isAuthenticated){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  
  const {githubUser}= jwt.decode(token)
  return {
    props: {githubUser},
  }
}