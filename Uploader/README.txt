COPYRIGHT: CRABBÉ Pierre-Alexandre
LINKEDIN: https://www.linkedin.com/in/pierre-alexandre-crabbé-679058182/


VERSION : v1.0.0
DEPENDENCIES :
- browser-image-compression
- firebase
- webp-converter-browser

INSTALL CMD : npm i browser-image-compression firebase webp-converter-browser

HOW TO USE :
1. Modify "firebase.js" file with your firebase web storage informations
2. Import Uploader component in your project
3. In the props, set type to 'image, 'video' or 'file'. An image will be compressed and converted to webp
4. You can get the uploaded file's URL with the callback function of the 'visualization' props
5. You can get the selected file's name with the callback function of the 'getFileName' props

Enjoy <3