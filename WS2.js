const Stations = {
    AEL:
        '<option class="AEL" value="HOK">Hong Kong</option> \
                <option class="AEL" value="KOW">Kowloon</option> \
                <option class="AEL" value="TSY">Tsing Yi</option> \
                <option class="AEL" value="AIR">Airport</option> \
                <option class="AEL" value="AWE">AsiaWorld Expo</option>',
    TCL:
        '<option class="TCL" value="HOK">Hong Kong</option> \
                <option class="TCL" value="KOW">Kowloon</option> \
                <option class="TCL" value="OLY">Olympic</option> \
                <option class="TCL" value="NAC">Nam Cheong</option> \
                <option class="TCL" value="LAK">Lai King</option> \
                <option class="TCL" value="TSY">Tsing Yi</option> \
                <option class="TCL" value="SUN">Sunny Bay</option> \
                <option class="TCL" value="TUC">Tung Chung</option>',
    WRL:
        '<option class="WRL" value="HUH">Hung Hom</option> \
                <option class="WRL" value="ETS">East Tsim Sha Tsui</option> \
                <option class="WRL" value="AUS">Austin</option> \
                <option class="WRL" value="NAC">Nam Cheong</option> \
                <option class="WRL" value="MEF">Mei Foo</option> \
                <option class="WRL" value="TWW">Tsuen Wan West</option> \
                <option class="WRL" value="KSR">Kam Sheung Road</option> \
                <option class="WRL" value="YUL">Yuen Long</option> \
                <option class="WRL" value="LOP">Long Ping</option> \
                <option class="WRL" value="TIS">Tin Shui Wai</option> \
                <option class="WRL" value="SIH">Siu Hong</option> \
                <option class="WRL" value="TUM">Tuen Mun</option>',
    TKL:
        '<option class="TKL" value="NOP">North Point</option> \
                <option class="TKL" value="QUB">Quarry Bay</option> \
                <option class="TKL" value="YAT">Yau Tong</option> \
                <option class="TKL" value="TIK">Tiu Keng Leng</option> \
                <option class="TKL" value="TKO">Tseung Kwan O</option> \
                <option class="TKL" value="LHP">LOHAS Park</option> \
                <option class="TKL" value="HAH">Hang Hau</option> \
                <option class="TKL" value="POA">Po Lam</option>',
};

let currentClass = "AEL"; //assume Airport Express line initially
let line = document.getElementById("line");
line.addEventListener("change", (evt) => {
    let select = line.value;
    if (select != currentClass) {
        //there is a change
        let station = document.querySelector("#station");
        station.innerHTML = Stations[select];
        currentClass = select;
    }
});
const stnList = {
    HOK: "Hong Kong",
    KOW: "Kowloon",
    TSY: "Tsing Yi",
    AIR: "Airport",
    AWE: "AsiaWorld Expo",
    HOK: "Hong Kong",
    KOW: "Kowloon",
    OLY: "Olympic",
    NAC: "Nam Cheong",
    LAK: "Lai King",
    TSY: "Tsing Yi",
    SUN: "Sunny Bay",
    TUC: "Tung Chung",
    HUH: "Hung Hom",
    ETS: "East Tsim Sha Tsui",
    AUS: "Austin",
    NAC: "Nam Cheong",
    MEF: "Mei Foo",
    TWW: "Tsuen Wan West",
    KSR: "Kam Sheung Road",
    YUL: "Yuen Long",
    LOP: "Long Ping",
    TIS: "Tin Shui Wai",
    SIH: "Siu Hong",
    TUM: "Tuen Mun",
    NOP: "North Point",
    QUB: "Quarry Bay",
    YAT: "Yau Tong",
    TIK: "Tiu Keng Leng",
    TKO: "Tseung Kwan O",
    LHP: "LOHAS Park",
    HAH: "Hang Hau",
    POA: "Po Lam",
};
let bttn = document.getElementById("bttn");
bttn.addEventListener("click", fRequest); //register the handler fRequest

function fRequest() {
    let line = document.getElementById("line").value; //get the MTR line
    let station = document.getElementById("station").value; //get the station

    fetch(
        `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${station}`
    ).then((response) => {
        if (response.status == 200) {
            //receive response successfully
            response.json().then((schedule) => {
                let output = "";
                if (schedule.status == 0) {
                    //Special Train Service
                    output += schedule.message;
                    if (schedule.url)
                        output += `<br><a href='${schedule.url}'>${schedule.url}</a>`;
                } else {
                    if (schedule.isdelay == "Y") {
                        //Data Absence
                        output = "No data is available";
                    } else {
                        //Normal response
                        let dataUP = schedule.data[line + "-" + station].UP;
                        let dataDN = schedule.data[line + "-" + station].DOWN;
                        if (dataUP) {
                            //has the UP data
                            for (let train of dataUP) {
                                let time = train.time.substr(11, 5);
                                output += "<span>Time: " + time + "</span>";
                                output += "<span>Platform: " + train.plat + "</span>";
                                output +=
                                    "<span>Destination: " + stnList[train.dest] + "<br></span>";
                            }
                            output += "<br>";
                        }
                        if (dataDN) {
                            //has the DOWN data
                            for (let train of dataDN) {
                                if (Object.keys(train).length) {
                                    //May not have data – Last Train
                                    let time = train.time.substr(11, 5);
                                    output += "<span>Time: " + time + "</span>";
                                    output += "<span>Platform: " + train.plat + "</span>";
                                    output += "<span>Destination: " + stnList[train.dest] + "<br></span>";
                                }
                            }
                        }
                    }
                } //Write the data beneath the button
                document.getElementById("output").innerHTML = output;
            });
        } else {
            console.log("HTTP return status: " + response.status);
        }
    });
}