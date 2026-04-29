import { changeNormalNumberWithWhatsAppNumber } from "../Contacts/changeWhatsAppNumberWithNormalNumber.js"
export async function findAndCheckChat(Number, i, Time, WhatsAppBotClient) {
  let result = false;
  let iteration2 = i % Time.Agents;
  let waNumber = changeNormalNumberWithWhatsAppNumber(Number)

  // console.log("Chat finding with contact's .......................", parseInt(Number))8
  try {
    console.log("Chat finding with contact's .......................", (WhatsAppBotClient.authStrategy.clientId))
    console.log("Chat finding with WA Number contact's .......................", (waNumber))

    result = await WhatsAppBotClient.getChatById(Number)
    return result

  } catch (error) {
    console.log(error)
  }
}