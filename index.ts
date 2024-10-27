import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./structs/Bot";
import {Song} from "./structs/Song"
import express from "express"

export const bot = new Bot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ]
  })
);

const app = express();
const port = process.env.PORT || 4000;

app.get("/", async (req, res, next) => {
  const musics = bot.queues.map((sla) => sla.songs)[0];
  try {
    res.send(html(musics));
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const html = (queue: Song[] | undefined) => {
  let queueCards = "";
  let currentSongCard = "<div>O bot não está reproduzindo nada no momento</div>";

  if (queue) {
    for (const song of queue.slice(1)) {
      const minutes = Math.trunc(song.duration / 60);
      const seconds = song.duration % 60;
      const durationText = minutes ? `${minutes} min e ${seconds}s` : `${seconds}s`;
      queueCards += `
        <div>
          <a href="${song.url}"> ${song.title} - ${durationText}</a>
        </div>
      `;
    }

    if (queue.length) {
      const minutes = Math.trunc(queue[0].duration / 60);
      const seconds = queue[0].duration % 60;
      const durationText = minutes ? `${minutes} min e ${seconds}s` : `${seconds}s`;
      currentSongCard = `
        <div>
          <a href="${queue[0].url}"> ${queue[0].title} - ${durationText}</a>
        </div>
      `;
    }
}

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Porraralho</title>
        <script>
          setTimeout(async () => {
            location.reload()
          }, 5000)
        </script>
        <style>
          @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
          @font-face {
            font-family: "neo-sans";
            src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
            font-style: normal;
            font-weight: 700;
          }
          html {
            font-family: neo-sans;
            font-weight: 700;
            font-size: calc(62rem / 16);
          }
          body {
            background: white;
          }
          main {
            border-radius: 1em;
            padding: 1em;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-right: -50%;
            transform: translate(-50%, -50%);
          }
        </style>
      </head>
      <body>
        <main>
          ${currentSongCard}
          ${queueCards}
        </main>
      </body>
    </html>
  `;
};
