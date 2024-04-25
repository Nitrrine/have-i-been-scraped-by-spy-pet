// Configurable vars
const API_URL = "https://kickthespy.pet"

const REPO_USER = "Nitrrine"
const REPO_NAME = "have-i-been-scraped-by-spy-pet"

// Misc
const goodResult = document.getElementById("good-result")
const badResult = document.getElementById("bad-result")
const errorResult = document.getElementById("error-result")
const infoResult = document.getElementById("info-result")

let globalData = []

// Provider's API
const ThatSINEWAVE_LIST_URL =
  "https://raw.githubusercontent.com/ThatSINEWAVE/Spy.pet-Info/main/data/servers_and_ids.json"

// Functions
function showBadResult(botName, botUsername, botId, botAvatar) {
  document.getElementById("botName").innerText = botName
  document.getElementById("botUsername").innerText = botUsername
  document.getElementById("botId").innerText = botId
  document.getElementById("botAvatar").setAttribute("src", botAvatar)

  goodResult.classList.add("hide")
  badResult.classList.remove("hide")
  errorResult.classList.add("hide")
  infoResult.classList.add("hide")
}

function showGoodResult() {
  goodResult.classList.remove("hide")
  badResult.classList.add("hide")
  errorResult.classList.add("hide")
  infoResult.classList.add("hide")
}

function showError(error) {
  document.getElementById("error").innerText = error

  goodResult.classList.add("hide")
  badResult.classList.add("hide")
  errorResult.classList.remove("hide")
  infoResult.classList.add("hide")
}

function showInfo(error) {
  document.getElementById("info").innerText = error

  goodResult.classList.add("hide")
  badResult.classList.add("hide")
  errorResult.classList.add("hide")
  infoResult.classList.remove("hide")
}

function copyText(text) {
  navigator.clipboard.writeText(text)
  alert(`Copied "${text}"!`)
}

// Do something on page load
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("createIssueLink")
    .setAttribute("href", `https://github.com/${REPO_USER}/${REPO_NAME}/issues`)
})

// When we click button, main process begins here
document
  .getElementById("check-btn")
  .addEventListener("click", function (event) {
    const serverId = document.getElementById("serverId").value
    const provider = document.getElementById("provider").value

    // Fix sending empty serverID
    if (!serverId.length) return

    if (parseInt(serverId)) {
      // This is minimum Discord server ID length
      if (serverId.length < 18) {
        showError(
          "Please check Discord Server ID field, use FAQ if you don't know how to get Server ID"
        )
        return
      }

      // Checks what provider is being used, currently we have only one but maybe new in future?
      if (provider == "default") {
        fetch(`${API_URL}/getBot?id=${serverId}`)
          .then((response) => response.json())
          .then((data) => {
            // If response contains bot ID == server is being tracked
            if (data.id) {
              showBadResult(
                data.global_name,
                data.username,
                data.id,
                data.avatarURL
              )

              globalData = data
            } else {
              showGoodResult()
            }
          })
          .catch((error) => showError(error))
      } else if (provider == "thatsinewave") {
        fetch(ThatSINEWAVE_LIST_URL)
          .then((response) => {
            // If response contains guild ID == server is being tracked
            response.text().then(function (content) {
              if (content.includes(serverId)) {
                showInfo(
                  `Oh no! This server is being tracked by spy.pet.\n\nData is provided by "Spy.pet Info" made by ThatSINEWAVE.`
                )
              } else {
                showGoodResult()
              }
            })
          })
          .catch((error) => showError(error))
      }
    } else {
      const splitInviteLink = serverId.split("/")
      const inviteLink = splitInviteLink[splitInviteLink.length - 1]

      fetch(`${API_URL}/byInv?code=/${inviteLink}`)
        .then((response) => response.json())
        .then((data) => {
          // If response contains bot ID == server is being tracked
          if (data.id) {
            showBadResult(
              data.global_name,
              data.username,
              data.id,
              data.avatarURL
            )

            globalData = data
          } else {
            showGoodResult()
          }
        })
        .catch((error) => showError(error))
    }
  })

document.getElementById("copy-ban-command").addEventListener("click", () => {
  copyText(
    `/ban user:@${globalData.username} delete_messages:Don't Delete Any reason:spy.pet bot account`
  )
})

document.getElementById("copy-username").addEventListener("click", () => {
  copyText(globalData.username)
})

document.getElementById("copy-id").addEventListener("click", () => {
  copyText(globalData.id)
})
