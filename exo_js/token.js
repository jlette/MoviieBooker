const user =
  '{"firstname": "toto","lastname": "titi","email": "toto.tit@gmail.com","password": "Password@123"}';
function generationToken(user) {
  let token = window.btoa(user);
  return token;
}
const token = generationToken(user);
console.log(token);

function verifyToken(token) {
  let decoded = window.atob(token);
  return decoded;
}

const decoded = verifyToken(token);
console.log(decoded);
