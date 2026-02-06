import Account from "../../../../models/Account";

let usersAccounts = {}; // Temporary in-memory storage (Use database for production)

export default function handler(req, res) {
  const { userId, action, amount, recipientId } = req.body;
  
  if (!usersAccounts[userId]) {
    usersAccounts[userId] = new Account(userId);
  }

  const userAccount = usersAccounts[userId];

  switch (action) {
    case "deposit":
      userAccount.deposit(amount);
      return res.status(200).json({ message: "Deposit Successful", balance: userAccount.balance });

    case "withdraw":
      if (userAccount.withdraw(amount)) {
        return res.status(200).json({ message: "Withdrawal Successful", balance: userAccount.balance });
      }
      return res.status(400).json({ message: "Insufficient Funds" });

    case "transfer":
      if (!usersAccounts[recipientId]) return res.status(400).json({ message: "Recipient not found" });

      if (userAccount.transfer(amount, usersAccounts[recipientId])) {
        return res.status(200).json({ message: "Transfer Successful", balance: userAccount.balance });
      }
      return res.status(400).json({ message: "Transfer Failed. Insufficient Funds" });

    default:
      return res.status(400).json({ message: "Invalid Action" });
  }
}
