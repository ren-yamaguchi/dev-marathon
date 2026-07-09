// -------------------------------------------------------------
// 顧客情報入力フォームのテスト
// -------------------------------------------------------------

describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
    cy.visit('/nishi/customer/add.html'); // テスト対象のページにアクセス
    cy.window().then((win) => {
      // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
    });

    // テストデータの読み込み
    cy.fixture('customerData').then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      cy.get('#companyName').type(data.companyName);
      cy.get('#industry').type(data.industry);
      cy.get('#contact').type(uniqueContactNumber);
      cy.get('#location').type(data.location);
    });

    // フォームの送信
    cy.get('#customer-form').submit();

    cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に保存されました。');

    // フォームがリセットされたことを確認
    cy.get('#companyName').should('have.value', '');
    cy.get('#industry').should('have.value', '');
    cy.get('#contact').should('have.value', '');
    cy.get('#location').should('have.value', '');
    cy.wait(5000);
  });
});

// -------------------------------------------------------------
// 顧客一覧表示のテスト
// -------------------------------------------------------------

describe('顧客一覧表示のテスト', () => {
  it('顧客一覧が表示され、会社名から詳細画面に遷移できる', () => {
    cy.visit('/re_yamaguchi/customer/list.html');

    cy.get('#customer-list tr').should('have.length.greaterThan', 0);

    cy.get('#customer-list tr').first().find('a').invoke('text').then((companyName) => {
      cy.get('#customer-list tr').first().find('a').click();

      cy.url().should('include', 'detail.html?id=');
      cy.get('[data-field="company_name"]').should('have.text', companyName);
    });
  });
});

// -------------------------------------------------------------
// 顧客情報更新のテスト
// -------------------------------------------------------------

describe('顧客情報更新のテスト', () => {
  it('新規顧客を登録し、その顧客の情報を更新して成功メッセージを確認する', () => {
    cy.visit('/re_yamaguchi/customer/add.html');
    const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    cy.get('#companyName').type('更新テスト株式会社');
    cy.get('#industry').type('IT');
    cy.get('#contact').type(uniqueContactNumber);
    cy.get('#location').type('東京都');
    cy.get('#customer-form').submit();
    cy.get('#register-btn').click();
    cy.get('#result-message').should('be.visible');

    cy.visit('/re_yamaguchi/customer/list.html');
    cy.contains('#customer-list tr', '更新テスト株式会社')
      .find('input[type=checkbox]').check();
    cy.get('#edit-btn').click();

    cy.url().should('include', 'update.html?id=');
    cy.get('#companyName').clear().type('更新後株式会社');
    cy.get('#customer-form').submit();

    cy.url().should('include', 'update-confirm.html');
    cy.get('[data-field="companyName"]').should('have.text', '更新後株式会社');
    cy.get('#register-btn').click();

    cy.get('#result-message')
      .should('be.visible')
      .and('contain.text', '顧客情報が正常に更新されました。');
  });
});

