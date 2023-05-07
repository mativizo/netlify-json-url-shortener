const path = require('path')
const fs = require('fs')

// create path to ./urls.json
const settingsPath = path.join(__dirname, '..', '..', 'settings.json')

const getSettings = () => {
    const urls = {}
    let fileContents = {}
    
    // try to read file
    try {
        fileContents =  JSON.parse(fs.readFileSync(settingsPath))
    } catch (err) {
        console.log("Can't read file: "+err)
    }

    let config = {}

    if (fileContents.config) {
        config = {
            urlList: false,
            urlListSlug: false,
            url404: false,
            autoAddHttpsPrefix: true
        }

        config = {
            ...config,
            ...fileContents.config
        }

        if (typeof config.urlListSlug == 'string') {
            config.urlListSlug = (config.urlListSlug.startsWith("/")) ? config.urlListSlug : `/${config.urlListSlug}`
        }
    }

    if (fileContents.urls.length > 0) {
        for (let i = 0; i < fileContents.urls.length; i++) {
            const item = fileContents.urls[i]
            if ("slug" in item && "url" in item) {
                if (typeof item.slug === "string") {
                    const slug = (item.slug.startsWith("/")) ? item.slug : `/${item.slug}`
                    let url = item.url
                    if (config.autoAddHttpsPrefix) {
                        url = (url.toLowerCase().includes('://')) ? url : `https://${url}`
                    }
                    urls[slug] = url
                } else if (typeof item.slug === 'array') {
                    for (let j = 0; j < item.slug.length; j++) {
                        const slug = (item.slug[j].startsWith("/")) ? item.slug[j] : `/${item.slug[j]}`
                        let url = item.url
                        if (config.autoAddHttpsPrefix) {
                            url = (url.toLowerCase().includes('://')) ? url : `https://${url}`
                        }
                        urls[slug] = url
                    }
                }
            }
        }
    }

    

    return { config, urls } 
}


exports.handler = async (event, context) => {
    let slug = event.queryStringParameters.slug;

    if (!slug) slug = "/"
    if (!slug.startsWith("/")) slug = `/${slug}`

    const {config, urls}  = getSettings()
    if (config.urlList) {
        if (slug == config.urlListSlug) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `List of the urls`,
                    urls: urls
                })
            }
        }
    }

    let url = urls[slug]

    if (url) {
        return {
            statusCode: 302,
            headers: {
                'Location': urls[slug]
            }
        }
    } else {
        if (config.url404) {
            return {
                statusCode: 302,
                headers: {
                    'Location': config.url404
                }
            }
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Not found: ${slug}`
                })
            }
        }
    }
}