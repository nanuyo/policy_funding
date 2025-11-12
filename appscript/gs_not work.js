/**
 * HTML 폼에서 POST 요청을 받아 구글 시트의 첫 번째 시트에 데이터를 기록합니다.
 * @param {Object} e - doPost 이벤트 객체. 폼 데이터는 e.postData.contents에 JSON 문자열로 포함됩니다.
 * @returns {ContentService.TextOutput} - 작업 결과를 나타내는 JSON 응답.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // ⚠️ 아래 변수에 자신의 텔레그램 봇 토큰과 채팅 ID를 입력하세요.
  var telegramBotToken = "8269876115:AAHG3yKbr-Nh55-lF85ij9lqv-V9_D3bLEc"; // 예: "1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
  var telegramChatId = "7725497411";   // 예: "@your_channel_name" 또는 "123456789"

  try {
    // 스크립트가 연결된 현재 스프레드시트를 가져옵니다.
    // POST 요청으로 받은 JSON 데이터를 파싱합니다.
    var data = JSON.parse(e.postData.contents);

    // 시트에 기록할 헤더(제목)와 데이터 키를 순서대로 정의합니다.
    var headers = [
      '신청일시', '업체명', '이름', '연락처', '사업자번호', 
      '사업장지역', '연매출', '업종', '유입경로'
    ];
    var headerKeys = [
      'timestamp', 'companyName', 'name', 'phone', 'businessRegistrationNumber', 
      'region', 'lastYearSales', 'businessType', 'referralPath'
    ];

    // 시트의 첫 번째 행이 비어있으면(데이터가 없으면) 헤더를 추가합니다.
    if (sheet.getLastRow() < 1) {
      sheet.appendRow(headers);
    }

    // 헤더 순서에 맞게 데이터 배열(newRow)을 생성합니다.
    // 전송된 데이터(data)에 해당 키가 없는 경우, 빈 문자열('')로 처리합니다.
    var newRow = headerKeys.map(function(key) {
      return data[key] !== undefined ? data[key] : '';
    });

    // 시트에 새로운 행으로 데이터를 추가합니다.
    sheet.appendRow(newRow);

    // 텔레그램 알림 메시지 전송 (토큰과 채팅 ID가 기본값이 아닐 경우에만)
    if (telegramBotToken && telegramChatId && telegramBotToken !== "YOUR_TELEGRAM_BOT_TOKEN" && telegramChatId !== "YOUR_TELEGRAM_CHAT_ID") {
      var message = "[신규 상담 신청]\n\n" +
                    "신청일시: " + (data.timestamp || '미입력') + "\n" +
                    "업체명: " + (data.companyName || '미입력') + "\n" +
                    "이름: " + (data.name || '미입력') + "\n" +
                    "연락처: " + (data.phone || '미입력') + "\n" +
                    "사업자번호: " + (data.businessRegistrationNumber || '미입력') + "\n" +
                    "사업장지역: " + (data.region || '미입력') + "\n" +
                    "연매출: " + (data.lastYearSales || '미입력') + "\n" +
                    "업종: " + (data.businessType || '미입력') + "\n\n" +
                    "유입경로: " + (data.referralPath || '미입력');
      
      var telegramUrl = "https://api.telegram.org/bot" + telegramBotToken + "/sendMessage?chat_id=" + telegramChatId + "&text=" + encodeURIComponent(message);
      
      // UrlFetchApp을 사용하여 텔레그램 API에 요청을 보냅니다.
      UrlFetchApp.fetch(telegramUrl);
    }

    // 클라이언트(웹페이지)에 성공 응답을 반환합니다.
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 오류 발생 시 로그를 남기고 클라이언트에 오류 응답을 반환합니다.
    Logger.log(error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
