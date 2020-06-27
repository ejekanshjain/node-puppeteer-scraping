const express = require('express')
const cors = require('cors')
const puppeteer = require('puppeteer')

const app = express()

app.use(cors())

app.get('/', async (req, res) => {
    if (!req.query.url)
        return res.status(400).json({ status: 400, message: 'url required in query params!' })
    let browser
    try {
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        })
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', err)
        return res.status(500).json({ status: 500, message: 'Failed to launch browser instance.' })
    }
    try {
        const page = await browser.newPage()
        await page.goto(req.query.url)
        const content = await page.content()
        res.json({ status: 200, data: content })
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', err)
        res.status(500).json({ status: 500, message: err.toString() })
    } finally {
        await browser.close()
    }
})

app.listen(process.env.PORT || 5000, console.log(`Server Started on port ${process.env.PORT || 5000}...`))