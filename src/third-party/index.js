function getStatistic(workspace) {
    const monthStatistic = new Statistic({});

    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth() + 1, -now.getDate());

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, -now.getDate() + 1);

    for (let i = 0; i < workspace.transactions.length; i++) {
        if (workspace.transactions[i].type === "outcome" && workspace.transactions[i].date >= firstDay
            && workspace.transactions[i].date <= lastDay) {
            monthStatistic.outcome += workspace.transactions[i].amount;
            monthStatistic.outcomeTransaction.push(workspace.transactions[i]);
        } else if (workspace.transactions[i].date >= firstDay
            && workspace.transactions[i].date <= lastDay) {
            monthStatistic.income += workspace.transactions[i].amount;
            monthStatistic.incomeTransaction.push(workspace.transactions[i]);
        }
    }

    monthStatistic.balance = monthStatistic.income - monthStatistic.outcome;

    return monthStatistic;
}