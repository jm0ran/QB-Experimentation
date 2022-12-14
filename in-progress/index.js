const axios = require("axios")
const FormData = require('form-data')
var cookie = new String()
const { appInfo } = require("./app-specific.js")

const host = appInfo.host

function login(username, password){
    /*
    Login to QBittorrent WebUI and return cookie used for all other operations with the WebUI
    */
    return new Promise((res, rej) =>{
        const loginInfo = new FormData()
        loginInfo.append("username", username)
        loginInfo.append("password", password)

        axios.post(host + "/api/v2/auth/login", loginInfo)
        .then((response) => {
            if(response.data == "Ok."){
                res(response.headers["set-cookie"][0].split(";")[0]) //I want to sort this to the set cookie
            }
            else{
                rej(response)
            }     
        },
        (error) => {
            rej(error)
        })
    })
}

function get_blob(input_cookie){
    /*
    Gets a general blob of all torrents from the WEBUI, can use this to build the interface
    */
    return new Promise((res, rej) => {
        headers = {
            headers : {
            Referer: host,
            Cookie : input_cookie
        }
    }
        axios.get(host + "/api/v2/torrents/info", headers)
        .then((response) => {
            res(response)
        },
        (error) => {
            rej(error)
        })
    })
}

function get_blob_cat(input_cookie, category){
    /*
    Gets a general blob of all torrents from the WEBUI passing in a category, can use this to build the interface
    */
    return new Promise((res, rej) => {
        const dataToPass = new FormData()
        dataToPass.append("category", category)

        options = {
            headers : {
            Referer: host,
            Cookie : input_cookie
        }
    }
        axios.post(host + "/api/v2/torrents/info", dataToPass, options)
        .then((response) => {
            res(response)
        },
        (error) => {
            rej(error)
        })
    })
}


login(appInfo.username, appInfo.password)
.then((result) => get_blob_cat(result, appInfo.categoryToSearch)).then((result2) => {
    console.log(result2)
})

