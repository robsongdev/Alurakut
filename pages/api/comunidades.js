import {SiteClient} from 'datocms-client'

export default async function recebedorDeRequests(request,response){
    if(request.method === 'POST') {
        const client = new SiteClient('54718c74f82890f950b46bf60189f3');
        const record = await client.items.create({
            itemType: "966843",
            ...request.body,
            // title: "Team Colheita Feliz",
            // imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.clickgratis.com.br%2F_upload%2Fdownloads%2F2014%2F10%2F13%2Fcolheita-feliz-543bb231d2ad4-icon.png&f=1&nofb=1",
            // creatorSlug: "robsongdev",
        })
        response.json({
            dados: "alguma coisa",
            registroCriado: record,
        })
        return

    }

    response.status(404).json({
        message: "ainda não temos nada no GET, mas no POST sim"
    })
}