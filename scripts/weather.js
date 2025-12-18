// 天气代码到图标和描述的映射（Open-Meteo使用WMO代码）
const wmoWeatherCodes = {
    0: { icon: '☀️', text: '晴', desc: '晴朗' },
    1: { icon: '🌤️', text: '晴', desc: '基本晴朗' },
    2: { icon: '⛅', text: '多云', desc: '局部多云' },
    3: { icon: '☁️', text: '阴', desc: '阴天' },
    45: { icon: '🌫️', text: '雾', desc: '雾' },
    48: { icon: '🌫️', text: '雾', desc: '冻雾' },
    51: { icon: '🌦️', text: '小雨', desc: '细雨' },
    53: { icon: '🌦️', text: '小雨', desc: '中细雨' },
    55: { icon: '🌧️', text: '小雨', desc: '浓细雨' },
    56: { icon: '🌧️', text: '冻雨', desc: '冻细雨' },
    57: { icon: '🌧️', text: '冻雨', desc: '浓冻细雨' },
    61: { icon: '🌧️', text: '雨', desc: '小雨' },
    63: { icon: '🌧️', text: '雨', desc: '中雨' },
    65: { icon: '🌧️', text: '雨', desc: '大雨' },
    66: { icon: '🌧️', text: '冻雨', desc: '冻雨' },
    67: { icon: '🌧️', text: '冻雨', desc: '冻大雨' },
    71: { icon: '❄️', text: '雪', desc: '小雪' },
    73: { icon: '❄️', text: '雪', desc: '中雪' },
    75: { icon: '❄️', text: '雪', desc: '大雪' },
    77: { icon: '❄️', text: '雪', desc: '雪粒' },
    80: { icon: '🌦️', text: '阵雨', desc: '小阵雨' },
    81: { icon: '🌧️', text: '阵雨', desc: '中阵雨' },
    82: { icon: '🌧️', text: '阵雨', desc: '大阵雨' },
    85: { icon: '❄️', text: '阵雪', desc: '小阵雪' },
    86: { icon: '❄️', text: '阵雪', desc: '大阵雪' },
    95: { icon: '⛈️', text: '雷雨', desc: '雷暴' },
    96: { icon: '⛈️', text: '雷雨', desc: '弱雷雹' },
    99: { icon: '⛈️', text: '雷雨', desc: '强雷雹' }
};

// 根据天气给出养猫建议
function getCatSuggestion(weatherCode, temperature) {
    const temp = parseFloat(temperature);

    let suggestion = '';

    // 根据天气类型建议
    if (weatherCode <= 3) {
        suggestion = '天气良好，适合带猫咪晒太阳和户外活动';
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        suggestion = '有雾，建议让猫咪在室内活动';
    } else if (weatherCode >= 51 && weatherCode <= 67) {
        suggestion = '雨天潮湿，注意保持猫窝干燥';
    } else if (weatherCode >= 71 && weatherCode <= 86) {
        suggestion = '下雪天冷，注意给猫咪保暖';
    } else if (weatherCode >= 95) {
        suggestion = '雷雨天气，猫咪可能害怕，多安抚';
    } else {
        suggestion = '根据天气调整猫咪活动安排';
    }

    // 根据温度调整
    if (temp > 28) {
        suggestion += '，注意防暑降温，提供充足饮水';
    } else if (temp < 10) {
        suggestion += '，注意保暖，可以给猫咪准备温暖的窝';
    }

    return suggestion;
}

// 你的getSimpleWeather函数（保持原样）
async function getSimpleWeather() {
    try {
        // 获取IP地址对应的城市
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        const city = ipData.city || 'Beijing';

        // 使用Open-Meteo免费API（无需key）
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();

        return {
            city: city,
            temperature: Math.round(weatherData.current_weather.temperature) + '°C',
            weatherCode: weatherData.current_weather.weathercode,
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            rawData: weatherData.current_weather
        };
    } catch (error) {
        console.log('天气API请求失败:', error);
        return null;
    }
}

// 主要更新函数
async function updateDiaryWeather() {
    // 显示加载状态
    const statusEl = document.getElementById('diaryWeatherStatus');
    const tempEl = document.getElementById('diaryTemperature');
    if (statusEl) statusEl.textContent = '获取中...';
    if (tempEl) tempEl.textContent = '--°C';

    try {
        // 1. 获取天气数据
        const weatherData = await getSimpleWeather();

        if (!weatherData) {
            throw new Error('无法获取天气数据');
        }

        // 2. 更新日期（本地）
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const weekDay = weekDays[now.getDay()];

        const dateEl = document.getElementById('diaryDate');
        const weekEl = document.getElementById('diaryWeek');
        if (dateEl) dateEl.textContent = `${year}年${month}月${day}日`;
        if (weekEl) weekEl.textContent = weekDay;

        // 3. 解析天气数据
        const weatherCode = weatherData.weatherCode;
        const weatherInfo = wmoWeatherCodes[weatherCode] || { icon: '🌤️', text: '未知', desc: '未知天气' };

        // 判断白天夜晚
        const hour = now.getHours();
        const isNight = hour >= 18 || hour < 6;
        const displayIcon = isNight && weatherCode <= 3 ? '🌙' : weatherInfo.icon;
        const displayText = isNight && weatherCode <= 3 ? '夜间 ' + weatherInfo.text : weatherInfo.text;

        // 4. 更新DOM
        const iconEl = document.getElementById('diaryWeatherIcon');
        const tempEl2 = document.getElementById('diaryTemperature');
        const statusEl2 = document.getElementById('diaryWeatherStatus');
        const tipEl = document.getElementById('diaryLogTip');

        if (iconEl) iconEl.textContent = displayIcon;
        if (tempEl2) tempEl2.textContent = weatherData.temperature;
        if (statusEl2) statusEl2.textContent = displayText;

        // 5. 显示养猫建议
        if (tipEl) {
            const suggestion = getCatSuggestion(weatherCode, weatherData.temperature);
            tipEl.textContent = `${weatherData.city} ${displayText} ${weatherData.temperature}，${suggestion}`;
        }

        console.log('天气数据更新成功:', {
            city: weatherData.city,
            weather: displayText,
            temp: weatherData.temperature,
            code: weatherCode
        });

        return {
            date: `${year}-${month}-${day}`,
            week: weekDay,
            city: weatherData.city,
            weather: displayText,
            temperature: weatherData.temperature,
            icon: displayIcon,
            weatherCode: weatherCode,
            suggestion: getCatSuggestion(weatherCode, weatherData.temperature),
            timestamp: now.toISOString()
        };

    } catch (error) {
        console.error('天气更新失败:', error);

        // 降级到本地数据
        fallbackToLocal();
        return null;
    }
}

// 降级方案
function fallbackToLocal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const weekDay = weekDays[now.getDay()];

    const dateEl = document.getElementById('diaryDate');
    const weekEl = document.getElementById('diaryWeek');
    if (dateEl) dateEl.textContent = `${year}年${month}月${day}日`;
    if (weekEl) weekEl.textContent = weekDay;

    // 模拟数据
    const mockOptions = [
        { icon: '☀️', temp: '22°C', status: '晴' },
        { icon: '⛅', temp: '20°C', status: '多云' },
        { icon: '🌧️', temp: '18°C', status: '小雨' },
        { icon: '☁️', temp: '19°C', status: '阴' }
    ];
    const mock = mockOptions[Math.floor(Math.random() * mockOptions.length)];

    const iconEl = document.getElementById('diaryWeatherIcon');
    const tempEl = document.getElementById('diaryTemperature');
    const statusEl = document.getElementById('diaryWeatherStatus');
    const tipEl = document.getElementById('diaryLogTip');

    if (iconEl) iconEl.textContent = mock.icon;
    if (tempEl) tempEl.textContent = mock.temp;
    if (statusEl) statusEl.textContent = mock.status;
    if (tipEl) tipEl.textContent = `天气数据获取失败，使用模拟数据。${mock.status} ${mock.temp}`;
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('diaryDate')) {
        // 立即更新
        updateDiaryWeather();

        // 每隔30分钟更新一次（避免频繁调用）
        setInterval(updateDiaryWeather, 30 * 60 * 1000);
    }
});

// 暴露给全局
window.updateDiaryWeather = updateDiaryWeather;