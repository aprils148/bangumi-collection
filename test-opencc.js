const OpenCC = require('opencc-js');

// 測試OpenCC轉換
function testOpenCC() {
  try {
    const simplifiedText = "这是一段简体中文文本，用于测试OpenCC的转换功能。";
    const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
    const traditionalText = converter(simplifiedText);
    
    console.log("簡體原文:", simplifiedText);
    console.log("繁體轉換:", traditionalText);
  } catch (error) {
    console.error("轉換出錯:", error);
  }
}

// 執行測試
testOpenCC(); 