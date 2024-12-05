const axios = require("axios");
const { installFonts } = require("../helpers/render");

require("dotenv").config();

async function installFontsFromDatabase() {
    const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000/api/";
    const url = `${BACKEND_URL}fonts`;

    const response = await axios.get(url);
    let fonts = response.data.objects;
    let currentPage = response.data.current_page;
    let totalPages = response.data.num_pages;

    while (currentPage < totalPages) {
        const response = await axios.get(`${url}?page=${currentPage + 1}`);
        fonts = fonts.concat(response.data.objects);
        currentPage = response.data.current_page;
        totalPages = response.data.num_pages;
    }

    await installFonts(fonts.map((font) => font.file.url));
}

installFontsFromDatabase();
