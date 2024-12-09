const login = async () => {
  const email = document.getElementById('login_input').value;

  try {
    await axios.get(`${hostBaseUrl}/users/v1/check/${email}`);

    // 비밀번호 입력 칸생성
  } catch (error) {
    // 회원 가입 페이지로 이동
  }
};
