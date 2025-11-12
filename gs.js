function doPost(e) {
  // 스크립트가 연결된 현재 스프레드시트를 가져옵니다.
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // POST 요청으로 받은 JSON 데이터를 파싱합니다.
    var data = JSON.parse(e.postData.contents);

    // 데이터에 'type' 필드가 있고 그 값이 'pageview'인 경우
    if (data.type === 'pageview') {
      
      var sheet = spreadsheet.getSheets()[1];

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
        'timestamp', 'companyName', 'name', 'phone', 'businessRegistrationNumber', 'region', 'lastYearSales', 'businessType', 'referralPath','consultationTime'
      ];

      if (sheet.getLastRow() < 1) {
        sheet.appendRow(headers);
      }

      var newRow = headers.map(function(header) {
        return data[header] !== undefined ? data[header] : '';
      });

      sheet.appendRow(newRow);
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
