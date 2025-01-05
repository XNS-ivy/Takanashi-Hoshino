import axios from 'axios'

export async function wiki(country, string) {
    try {
        const url = `https://${country}.wikipedia.org/w/api.php`
        const responseUrl = await axios.get(url, {
            params: {
                format: 'json',
                action: 'query',
                list: 'search',
                srsearch: string,
                srlimit: 1,
                utf8: 1
            }
        })
        const firstResult = responseUrl.data.query.search[0]
        if (!firstResult) return `Sorry, result not found for: "${argumen}".`

        const title = firstResult.title
        const articleResponse = await axios.get(url, {
            params: {
                format: 'json',
                action: 'query',
                prop: 'extracts',
                exintro: true,
                explaintext: true,
                redirects: 1,
                titles: title
            }
        })
        const pages = articleResponse.data.query.pages
        const extract = pages[Object.keys(pages)[0]]?.extract
        const article = {
            title: title,
            body: extract,
        }
        return extract ? article : `Sorry, result not found for: "${string}".`
    } catch (error) {
        return error
    }
}