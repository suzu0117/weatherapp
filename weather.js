// 天気のデータを取得する関数
const get_weather_data = async(latitude,longitude)=> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('取得したAPIの中身',data);
        return data;
    } catch(error) {
        console.error('APIの取得に失敗しました',error);
    }
};

// 1週間の東京の天気を取得する関数
const get_weekly_weather = async(latitude,longitude)=> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(url);
        display_weekly_weather(data.daily);
    } catch(error) {
        console.error('東京の1週間の天気の取得に失敗しました',error);
    }
};

const display_weather = (data) => {
    //APIからデータ抜いてくる
    const current_hour = new Date().getHours();
    const current_temp = data.hourly.temperature_2m[current_hour];//現在の気温
    const max_temp = data.daily.temperature_2m_max[0];//最高気温
    const min_temp = data.daily.temperature_2m_min[0];//最低気温
    //抜いてきたデータをHTMLに反映
    document.getElementById('current_temp').textContent =`${current_temp}℃`;
    document.getElementById('max_temp').textContent =`${max_temp}℃`;
    document.getElementById('min_temp').textContent =`${min_temp}℃`;
}

//都道府県の緯度と経度のデータ
const prefectures = {
    札幌:{latitude:43.0620,longitude:141.3544},
    仙台:{latitude:38.1607,longitude:140.5220},
    東京:{latitude:35.4122,longitude:139.4130},
    名古屋:{latitude:35.1049,longitude:136.5424},
    大阪:{latitude:34.4111,longitude:135.3112},
    福岡:{latitude:33.3623,longitude:130.2505},
    那覇:{latitude:26.1245,longitude:127.4051},  
    //必要に応じて追加する
}
//天気コードとアイコン
const weather_icons = {
    0:'☀️',//晴れ
    1:'🌤️',//晴れ時々曇り
    2:'⛅',//曇り
    3:'☁️',//曇り
    45:'🌫️',//霧
    48:'🌫️',//霧
    51:'🌧️',//小雨
    61:'🌧️',//雨
    71:'❄️',//雪
    95:'⛈️',//雷雨
}
//東京の一週間の天気を表示する関数
const display_weekly_weather = (daily_data) => {
    const weather_list = document.getElementById('weekly_weather');
    weather_list.innerHTML = '';//初期化
    
    daily_data.time.forEach((date,index) => {
        const max_temp = daily_data.temperature_2m_max[index];
        const min_temp = daily_data.temperature_2m_min[index];
        const weather_code = daily_data.weathercode[index];
        const icon = weather_icons[weather_code];

        //抜いてきた情報をHTMLに表示
        const list_item = document.createElement('div');
        list_item.className = 'weather_item'
        list_item.innerHTML = `
            <p>${date}</p>
            <p class='icon'>${icon}</p>
            <p>最高:${max_temp}℃/最低:${min_temp}℃</p>
            <p class='partition'>-------------------------------------------------------<p>
        `;
        weather_list.appendChild(list_item);
    });
}
document.addEventListener('DOMContentLoaded',() => {
    const location_button = document.getElementById('get_location');
    //現在地の天気を取得する処理
    location_button.addEventListener('click',() => {
        if(navigator.geolocation){
            location_button.textContent = '取得中'; //ユーザーにフィードバック
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude,longitude} = position.coords;
                    get_weather_data(latitude,longitude).then((data) => {
                        //現在の天気の情報を表示する関数を入れる
                        display_weather(data);
                        location_button.textContent = '現在地の天気を取得';//ボタンのテキストを戻す
                    });
                },(error)=>{
                    alert('位置情報の取得に失敗しました。権限を確認してください。');
                    location_button.textContent ='現在地の天気を取得';
                    console.error('位置情報エラー',error);
                }
            );
        } else {
            alert('このブラウザは位置情報の取得をサポートしていません。');
        }
    });
    //初期値(東京)の天気を表示
    const {latitude,longitude} = prefectures['東京'];
    get_weekly_weather(latitude,longitude);

    const switch_location_button_sapporo = document.getElementById('switch_location_sapporo');
    switch_location_button_sapporo.addEventListener('click',() => {
        document.getElementById('text').innerText = '札幌の一週間の天気';
        const {latitude,longitude} = prefectures['札幌'];
        get_weekly_weather(latitude,longitude);
    });

    const switch_location_button_sendai = document.getElementById('switch_location_sendai');
    switch_location_button_sendai.addEventListener('click',() => {
        document.getElementById('text').innerText = '仙台の一週間の天気';
        const {latitude,longitude} = prefectures['仙台'];
        get_weekly_weather(latitude,longitude);
    });

    const switch_location_button_tokyo = document.getElementById('switch_location_tokyo');
    switch_location_button_tokyo.addEventListener('click',() => {
        document.getElementById('text').innerText = '東京の一週間の天気';
        const {latitude,longitude} = prefectures['東京'];
        get_weekly_weather(latitude,longitude);
    });
    const switch_location_button_nagoya = document.getElementById('switch_location_nagoya');
    switch_location_button_nagoya.addEventListener('click',() => {
        document.getElementById('text').innerText = '名古屋の一週間の天気';
        const {latitude,longitude} = prefectures['名古屋'];
        get_weekly_weather(latitude,longitude);
    });
    const switch_location_button_osaka = document.getElementById('switch_location_osaka');
    switch_location_button_osaka.addEventListener('click',() => {
        document.getElementById('text').innerText = '大阪府の一週間の天気';
        const {latitude,longitude} = prefectures['大阪'];
        get_weekly_weather(latitude,longitude);
    });
    const switch_location_button_hukuoka = document.getElementById('switch_location_hukuoka');
    switch_location_button_hukuoka.addEventListener('click',() => {
        document.getElementById('text').innerText = '福岡の一週間の天気';
        const {latitude,longitude} = prefectures['福岡'];
        get_weekly_weather(latitude,longitude);
    });
    const switch_location_button_naha = document.getElementById('switch_location_naha');
    switch_location_button_naha.addEventListener('click',() => {
        document.getElementById('text').innerText = '那覇の一週間の天気';
        const {latitude,longitude} = prefectures['那覇'];
        get_weekly_weather(latitude,longitude);
    });
});