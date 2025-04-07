const userTable = [
  {
    id: 1,
    nom: "Alice Dupont",
    email: "alice.dupont@example.com",
    age: 28,
    role: "admin",
  },
  {
    id: 2,
    nom: "Bob Martin",
    email: "bob.martin@example.com",
    age: 34,
    role: "user",
  },
  {
    id: 3,
    nom: "Charlie Leclerc",
    email: "charlie.leclerc@example.com",
    age: 22,
    role: "user",
  },
  {
    id: 4,
    nom: "Diana Rousseau",
    email: "diana.rousseau@example.com",
    age: 40,
    role: "moderator",
  },
];

function orderByRole(table) {
  const role = table.filter((table) => table.role === "user");
  return role;
}

const role = orderByRole(userTable);
console.log(role);
