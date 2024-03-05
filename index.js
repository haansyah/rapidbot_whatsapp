const qrcode = require("qrcode-terminal");
const axios = require("axios");
const config = require("./config.json");
const { Client } = require("whatsapp-web.js");
const client = new Client();
// const { tikdown } = require("nayan-media-downloader");

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  if (message.body === "!menu") {
    await message.reply(`Berikut beberapa fitur yang tersedia pada bot ini:
1. *!ping* untuk test connectivity bot
2. *!everyone* untuk memanggil semua member dalam grup
3. *!tiktok [url]* untuk mendownload video tiktok (underdevelopment)
4. *!ytvideo [url] [quality]* untuk mendownload video youtube (underdevelopment)
       note: kualitas default adalah 480p, tambahkan tag quality untuk memilih kualitas:
       _*380 | 480 | 720 | 1080*_
5. *!sticker* untuk mengubah gambar menjadi sticker whatsapp`);
  }
  if (message.body === "!ping") {
    await message.reply("pong");
    // await client.sendMessage(message.from, "testing");
  }

  if (message.body === "!everyone") {
    try {
      const isGroups = message.from.endsWith("@g.us") ? true : false;
      if (isGroups) {
        const chat = await message.getChat();

        let text = "";
        let mentions = [];

        for (let participant of chat.participants) {
          mentions.push(`${participant.id.user}@c.us`);
          text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
      } else {
        await message.reply("Lu mau manggil siapa blok?");
      }
    } catch (error) {
      client.sendMessage(message.from, "Failed! " + error);
    }
  }

  if (message.body === "#sticker") {
    try {
      const media = await message.downloadMedia();
      if (!media) {
        await message.reply("Fotonya mana blok!" + message);
      } else {
        client.sendMessage(message.from, media, {
          sendMediaAsSticker: true,
          stickerName: config.name,
          stickerAuthor: config.author,
        });
      }
    } catch (error) {
      client.sendMessage(message.from, "Failed!");
    }
  }

  // if (message.body.startsWith("#tiktok")) {
  //   const tiktokUrl = message.body.split(" ")[1];
  //   try {
  //     let url = await tikdown(tiktokUrl);
  //     const videoUrl = tiktokData.data.video;
  //     // Download the video as a buffer
  //     const response = await axios.get(videoUrl, {
  //       responseType: "arraybuffer",
  //     });

  //     client.sendMessage(message.from, url.data.video);

  //     // Send the video as a buffer
  //     await client.sendMessage(message.from, response.data, {
  //       sendVideoAsGif: false,
  //       caption: "Here's the TikTok video you requested:",
  //       replyTo: message.id,
  //     });
  //   } catch (error) {
  //     console.error("Error downloading or sending TikTok video:", error);
  //     await client.sendMessage(
  //       message.from,
  //       "Failed to download TikTok video."
  //     );
  //   }
  // }
});

client.initialize();
