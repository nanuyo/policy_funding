function doPost(e) {
  // 스크립트가 연결된 현재 스프레드시트를 가져옵니다.
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // ⚠️ 아래 변수에 자신의 텔레그램 봇 토큰과 채팅 ID를 입력하세요.
  var telegramBotToken = "8269876115:AAHG3yKbr-Nh55-lF85ij9lqv-V9_D3bLEc"; // 예: "1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
  var telegramChatId = "7725497411";   // 예: "@your_channel_name" 또는 "123456789"


  try {
    // POST 요청으로 받은 JSON 데이터를 파싱합니다.
    var data = JSON.parse(e.postData.contents);

    // 데이터에 'type' 필드가 있고 그 값이 'pageview'인 경우
    if (data.type === 'pageview') {
      var sheet = spreadsheet.getSheets()[1]; // 두 번째 시트를 사용
      if (!sheet) {
        sheet = spreadsheet.insertSheet('Sheet2');
      }

      var headers = ['timestamp', 'referralPath'];

      // 시트가 비어있으면 헤더를 추가합니다.
      if (sheet.getLastRow() < 1) {
        sheet.appendRow(headers);
      }

      // 헤더 순서에 맞게 데이터 배열을 생성합니다.
      var newRow = headers.map(function(header) {
        return data[header] !== undefined ? data[header] : '';
      });
      
      // 'Sheet2'에 새로운 행으로 데이터를 추가합니다.
      sheet.appendRow(newRow);

    } else {
      // 기존의 상담 신청 데이터 처리 로직 (첫 번째 시트에 저장)
      var sheet = spreadsheet.getSheets()[0]; // 첫 번째 시트를 사용
      var headers = [
        'timestamp', 'businessType', 'fundingAmount', 'consultationTime', 
        'companyName', 'name', 'phone', 'referralPath'
      ];

      if (sheet.getLastRow() < 1) {
        sheet.appendRow(headers);
      }

      var newRow = headers.map(function(header) {
        return data[header] !== undefined ? data[header] : '';
      });

      sheet.appendRow(newRow);

      // 텔레그램 알림 메시지 전송
      if (telegramBotToken !== "YOUR_TELEGRAM_BOT_TOKEN" && telegramChatId !== "YOUR_TELEGRAM_CHAT_ID") {
        var message = "[신규 상담 신청]\n\n" +
                      "신청시간: " + data.timestamp + "\n" +
                      "업종: " + data.businessType + "\n" +
                      "필요자금: " + data.fundingAmount + "\n" +
                      "상담시간: " + data.consultationTime + "\n" +
                      "업체명: " + (data.companyName || '미입력') + "\n" +
                      "이름: " + data.name + "\n" +
                      "연락처: " + data.phone + "\n\n" +
                      "유입경로: " + data.referralPath;
        
        var telegramUrl = "https://api.telegram.org/bot" + telegramBotToken + "/sendMessage?chat_id=" + telegramChatId + "&text=" + encodeURIComponent(message);
        UrlFetchApp.fetch(telegramUrl);
      }
    }

    // 성공 응답을 반환합니다.
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 오류 발생 시 로그를 남기고 오류 응답을 반환합니다.
    Logger.log(error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
