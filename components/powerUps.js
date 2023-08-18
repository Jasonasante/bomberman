import { globalSettings } from "../misc/gameSetting.js";
import RJNA from "../rjna/engine.js";
import {
    speedPressed,
    flamesPressed,
    bombsPressed,
    falseKeyBool,
} from "../misc/input.js";

export function placePowerUp(powerUpObj) {
    return RJNA.tag.div(
        {
            class: `power-up ${powerUpObj["powerUp"]}`, style: {
                top: powerUpObj["powerUpCoords"][0] * globalSettings["power-ups"]["height"] + "px",
                left: powerUpObj["powerUpCoords"][1] * globalSettings["power-ups"]["width"] + "px",
                width: `${globalSettings["power-ups"]["width"]}px`,
                height: `${globalSettings["power-ups"]["height"]}px`,
            },
            // id: `${powerUpObj["powerUpCoords"][0]}${powerUpObj["powerUpCoords"][1]}`
        },
        {},
        {},
        RJNA.tag.img(
            {
                style: {
                    width: "100%",
                    height: "100%",
                }
            },
            {},
            { src: globalSettings["power-ups"][powerUpObj["powerUp"]] })
    )
}

export function ActivatePowerUp(socket) {
    let moving = {
        myPlayerNum: socket.playerCount,
        speed: orbital["players"][`${socket.playerCount}`]["speed"] || globalSettings.speed.normal,
        flames: orbital["players"][`${socket.playerCount}`]["flames"] || globalSettings.flames.normal,
        bombs: orbital["players"][`${socket.playerCount}`]["bombs"] || globalSettings.bombs.normal,
    };
    let playerPowerUpsArr = orbital["players"][moving.myPlayerNum]["power-ups"];
    if (speedPressed) {
        console.log("speed pressed")
        falseKeyBool("speed-pressed");
        if (
            playerPowerUpsArr.indexOf("speed") !== -1
        ) {
            moving.speed = globalSettings.speed.fast;
            playerPowerUpsArr.splice(playerPowerUpsArr.indexOf("speed"), 1);
            setTimeout(() => {
                const revert = {
                    myPlayerNum: socket.playerCount,
                    speed: globalSettings.speed.normal,
                };
                socket.emit("player-movement", revert);
            }, 10000);
            let amountOfPowerUp = playerPowerUpsArr.filter(
                (power) => power === "speed"
            ).length;
            document.querySelector(`.speed-amount`).innerHTML = amountOfPowerUp;
        }
    }
    if (flamesPressed) {
        falseKeyBool("flames-pressed");
        if (playerPowerUpsArr.indexOf("flames") !== -1) {
            if (moving.flames === globalSettings.flames.normal) {
                moving.flames = globalSettings.flames.pickUp1;
            } else if (moving.flames === globalSettings.flames.pickUp1) {
                moving.flames = globalSettings.flames.pickUp2;
            } else if (moving.flames === globalSettings.flames.pickUp2) {
                moving.flames = globalSettings.flames.pickUp3;
            }
            playerPowerUpsArr.splice(playerPowerUpsArr.indexOf("flames"), 1);
            let amountOfPowerUp = playerPowerUpsArr.filter(
                (power) => power === "flames"
            ).length;
            document.querySelector(`.flames-amount`).innerHTML = amountOfPowerUp;
        }
    }

    if (bombsPressed) {
        falseKeyBool("bombs-pressed");
        if (playerPowerUpsArr.indexOf("bombs") !== -1) {
            orbital["players"][moving["myPlayerNum"]]["numOfBombs"]++
            playerPowerUpsArr.splice(playerPowerUpsArr.indexOf("bombs"), 1);
            let amountOfPowerUp = playerPowerUpsArr.filter(
                (power) => power === "bombs"
            ).length;
            document.querySelector(`.bombs-amount`).innerHTML = amountOfPowerUp;
        }
    }
    console.log("running all the time")
    socket.emit("player-movement", moving);
}