const redSpawn = [0,0,0] //あとで決める
const blueSpawn = [0,0,0] //あとで決める
const lobbySpawn = [0,0,0] //あとで決める
const beaconPos = [[0,0,0],[0,0,0]] //あとで決める

const gun = ["M1911","AK-47","M16","MP40","AWP","Double Barrel","TAR-21"] //まだあるかも
const hasGun = id => gun.every(gunName => !api.hasItem(id,gunName))

const phase0Time = 30*20 //30秒(tick単位だから)
const phase1Time = 10*60*20 //10分
let redTicket = 0
let blueTicket = 0
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
  if(api.getPlayerIds().length >= 2)startBattle()
}

const startBattle = () => {
  teamData.clear()
  setPlayerTeam()
  teamData.forEach((team,id) => setTeam(id,team))
  redTicket = 400
  blueTicket = 400
  for(const pos of beaconPos){
    api.setBlock(pos,"Beacon")
  }
}

const setTeam = (id,team) => {
  api.clearInventory(id)
  api.giveItem(id,"M1911")
  api.setPosition(id,team === 0?redSpawn:blueSpawn)
  giveKit(id)
}

const setPlayerTeam = () => {
  for(const [i,id] of api.getPlayerIds().entries())teamData.set(id,i%2);
}

const giveKit = id => {
  
}

const checkEnd = () => {
  let teamHas = [false,false]
  for(const [id,team] of Array.from(teamData)){
    teamHas[team] = true
    if(!teamHas.includes(false))break;
  }
  if(teamHas.includes(false)){
    end(teamHas.indexOf(false))
    return;
  }
  if(redTicket <= 0){
    end(0)
    return;
  }
  
  if(blueTicket <= 0){
    end(1)
    return;
  }

  if(count >= phase1Time){
    if(redTicket < blueTicket){
      end(0)
      return;
    }
    else{
      end(1)
      return
    }
  }
}

const end = (loseTeam) => {
  for(const id of api.getPlayerIds()){
    api.setPosition(id,lobbySpawn)
  }
  for(const [id,team] of Array.from(teamData)){
    if(team === loseTeam){lose(id)}else{win(id)};
  }
  teamData.clear()
}

const lose = id => {
  api.sendMessage(id,"敗北")
}

const win = id => {
  api.sendMessage(id,"勝利")
}

const downTicket = (team,amount) => {
  if(team === 0)redTicket -= amount
  if(team === 1)blueTicket -= amount
  api.broadcastMessage([{str:team === 0?"赤チームのチケット":"青チームのチケット",style:{color:team === 0?"red":"blue"}},`が${amount}減少し,${team === 0?redTicket:blueTicket}になりました`])
}

const setRightInfo = id => {
  let text = []
  if(phase === 0){
    //あとでやる
  }
  if(phase === 1){
    //あとでやる
  }
  api.setClientOption(id,"RightInfoText",text)
}

const getTeamPlayerAmount = () => {
  let redAmount = 0
  let blueAmount = 0
  for(const team of Array.from(teamData.values())){
    if(team === 0){
      redAmount++
    }
    else{
      blueAmount++
    }
  }
  return [redAmount,blueAmount]
}

onPlayerDamagingOtherPlayer = (ap,dp) => {
  if(teamData.has(ap) && teamData.has(dp))return;
  return "preventChange"
}

onPlayerKilledOtherPlayer = (ap,kp) => {
  if(teamData.has(kp)){
    const team = teamData.get(kp)
    downTicket(team,1)
    checkEnd()
  }
}

onPlayerChangeBlock = (id,x,y,z,from,to) => {
  if(to === "Beacon"){
    const team = teamData.get(id)
    downTicket(Number(!team),10) //壊した人の逆のチームにする
    return "preventChange"
  }
}

onPlayerJoin = id => {
  api.setPosition(id,lobbySpawn)
  if(phase === 1){
    const [redAmount,blueAmount] = getTeamPlayerAmount()
    if(red < blueAmount){
      teamData.set(id,0)
      setTeam(id,0)
    }
    else{
      teamData.set(id,1)
      setTeam(id,1)
    }
  }
}
