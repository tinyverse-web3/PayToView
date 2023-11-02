#!/usr/bin/env python
# pylint: disable=unused-argument
# This program is dedicated to the public domain under the CC0 license.

"""
Don't forget to enable inline mode with @BotFather

First, a few handler functions are defined. Then, those functions are passed to
the Application and registered at their respective places.
Then, the bot is started and runs until we press Ctrl-C on the command line.

Usage:
Basic inline bot example. Applies different text transformations.
Press Ctrl-C on the command line or send a signal to the process to stop the
bot.
"""
import json
import logging
from html import escape
from uuid import uuid4

from telegram import InlineQueryResultArticle, InputTextMessageContent, Update, InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo, SwitchInlineQueryChosenChat, Bot
from telegram.constants import ParseMode
from telegram.ext import Application, CommandHandler, ContextTypes, InlineQueryHandler, MessageHandler, filters

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


# Define a few command handlers. These usually take the two arguments update and
# context.
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message with a button that opens a the web app."""
    button_text = 'PayToView'
    user = update.message.from_user
    button_url = f'https://throbbing-art-9358.on.fleek.co/#/?user={user.id}'
    if 'read' not in context.args:

        await update.message.reply_text(
            "Open the web app",
            reply_markup=ReplyKeyboardMarkup([[KeyboardButton(
                text=button_text,
                web_app=WebAppInfo(
                    url=button_url),
            )]]

            ),
        )
    else:
        await context.bot.send_photo(
            chat_id=update.message.chat_id,
            photo='https://test.tinyverse.space/paytoview_blur.png',
            caption='<b>PayToView First Image</b>',
            parse_mode='HTML',
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton(
                    text="👛 Wallet Pay",
                    url="https://t.me/ItToolBot?start=read"
                ),
                InlineKeyboardButton(
                    text="Read Detail!",
                    web_app=WebAppInfo(
                        url="https://throbbing-art-9358.on.fleek.co/#/read")
                ),
            ]]
            )
        )
        # await update.message.reply_text(
        #     "<b>PayToView First Image</b>\n<a href='https://test.tinyverse.space/paytoview_blur.png'></a>",
        #     reply_markup=InlineKeyboardMarkup([[
        #         InlineKeyboardButton(
        #             text="Read Detail!",
        #             web_app=WebAppInfo(
        #                 url="https://throbbing-art-9358.on.fleek.co/#/read"),)]]
        #     ),
        # )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    await update.message.reply_text("Help!")


async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Print the received data and remove the button."""
    # Here we use `json.loads`, since the WebApp sends the data JSON serialized string
    # (see webappbot.html)
    data = json.loads(update.effective_message.web_app_data.data)
    title = data.get("title")
    description = data.get("description")
    image = data.get("image")

    text = ''
    if title:
        text += f"<b>{title}</b>\n\n"
    if description:
        text += f"{description}\n\n"

    text += 'Share this image with your friends!'

    await context.bot.send_photo(
        chat_id=update.message.chat_id,
        photo=image,
        caption=text,
        parse_mode='HTML',
        reply_markup=InlineKeyboardMarkup.from_button(
            InlineKeyboardButton(
                text="Read Detail!",
                url="https://t.me/ItToolBot?start=read"
            ),
        )
    )


def main() -> None:
    """Run the bot."""
    # Create the Application and pass it your bot's token.
    application = Application.builder().token(
        "6637121890:AAEnxTTF7FfKD_0bUzIT0n1red2fcUG68Sc").build()

    # on different commands - answer in Telegram
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))

    application.add_handler(MessageHandler(
        filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    # Run the bot until the user presses Ctrl-C
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
