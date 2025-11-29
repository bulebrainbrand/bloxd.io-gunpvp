const redSpawn = [0,0,0] //あとで決める
const blueSpawn = [0,0,0] //あとで決める
const lobbySpawn = [0,0,0] //あとで決める
const beaconPos = [[0,0,0],[0,0,0]] //あとで決める

const gun = ["M1911","AK-47","M16","MP40","AWP","Double Barrel","TAR-21"] //まだあるかも
const hasGun = id => gun.every(gunName => !api.hasItem(id,gunName))

const phase0Time = 30*20 //30秒(tick単位だから)
// teamindexは0がred,1がblue
let teamData = new Map() //id:teamindexのマップ
let count = 0
let phase = 0 //0は待機場所,1は試合中
tick = () => {
  count++
  if(phase === 0 && phase0Time <= count){
    phase = 1
    count = 0
    onChangePhaseTo1()
  }
}
const onChangePhaseTo1 = () => {
  
}

const startBattle = () => {
  
}

const setPlayerTeam = () => {
  
}
