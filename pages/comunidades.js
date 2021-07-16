import React from 'react'
import MainGrid from '../src/components/MainGrid'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'



export default function AllCommunities(){
    const [comunidades, setComunidades] = React.useState([{
        id:'1234',
        title:'Eu odeio acordar cedo',
        image:'https://alurakut.vercel.app/capa-comunidade-01.jpg'
      }])

    React.useEffect(function(){
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
      setComunidades(comunidadesVindasDoDato)
    })
  },[])

    return (
        <>
            <ProfileRelationsBoxWrapper style={{
                marginRight: "auto",
                marginLeft: "auto",
                height: "400px",
                minWidth: "400px"
            }}>
            <h2 className="smallTitle" >
                Comunidades({comunidades.length})
            </h2>
                
            
                <ul>
                    {comunidades.map((itemAtual)=>{
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
          </>
    )
}