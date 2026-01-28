export const config = {
  initialMessages: [{
    message: "Hello! Welcome to Nova Bank. How can I help you today?",
    type: "bot",
    id: 1
  }],
  botName: "Nova Assistant",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#FD5339",
    },
    chatButton: {
      backgroundColor: "#FD5339",
    },
  },
  widgets: [
    {
      widgetName: "accountBalance",
      widgetFunc: (props) => <BalanceWidget {...props} />,
      mapStateToProps: ["messages"]
    }
  ]
};

const BalanceWidget = (props) => (
  <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg transition-colors border dark:border-gray-700">
    <h3 className="text-[#FD5339] font-bold">Account Balance</h3>
    <p className="text-gray-600 dark:text-gray-300 mt-2">Current Balance: $2,450.00</p>
  </div>
);
export default config;