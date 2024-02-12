import {Component} from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {
  state = {
    username: '',
    password: '',
    token: '',
    transactions: [],
    category: '',
    amount: '',
    date: '',
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) {
      this.setState({token})
      this.loadTransactions(token)
    }
  }

  handleInputChange = event => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  handleLogin = () => {
    const {username, password} = this.state
    axios
      .post('/api/login', {username, password})
      .then(res => {
        const token = res.data.token
        this.setState({token})
        localStorage.setItem('token', token)
        this.loadTransactions(token)
      })
      .catch(err => console.error(err))
  }

  handleRegister = () => {
    const {username, password} = this.state
    axios
      .post('/api/register', {username, password})
      .then(res => console.log(res.data))
      .catch(err => console.error(err))
  }

  handleAddTransaction = () => {
    const {category, amount, date, token} = this.state
    axios
      .post(
        '/api/transactions',
        {category, amount, date},
        {headers: {Authorization: token}},
      )
      .then(res => {
        console.log(res.data)
        this.loadTransactions(token)
      })
      .catch(err => console.error(err))
  }

  handleDeleteTransaction = id => {
    const {token} = this.state
    axios
      .delete(`/api/transactions/${id}`, {headers: {Authorization: token}})
      .then(res => {
        console.log(res.data)
        this.loadTransactions(token)
      })
      .catch(err => console.error(err))
  }

  loadTransactions = token => {
    axios
      .get('/api/transactions', {headers: {Authorization: token}})
      .then(res => this.setState({transactions: res.data}))
      .catch(err => console.error(err))
  }

  render() {
    const {
      username,
      password,
      token,
      transactions,
      category,
      amount,
      date,
    } = this.state

    return (
      <div className="App">
        <h1>Personal Finance Tracker</h1>
        {!token ? (
          <div className="form-container">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={this.handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={this.handleInputChange}
            />
            <button type="button" onClick={this.handleLogin}>
              Login
            </button>
            <button type="button" onClick={this.handleRegister}>
              Register
            </button>
          </div>
        ) : (
          <div className="tracker-container">
            <h2>Welcome, {username}!</h2>
            <div className="transaction-form">
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={category}
                onChange={this.handleInputChange}
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={amount}
                onChange={this.handleInputChange}
              />
              <input
                type="date"
                name="date"
                value={date}
                onChange={this.handleInputChange}
              />
              <button type="button" onClick={this.handleAddTransaction}>
                Add Transaction
              </button>
            </div>
            <div className="transaction-list">
              <h3>Transactions</h3>
              <ul>
                {transactions.map(transaction => (
                  <li key={transaction.id}>
                    {transaction.category} - ${transaction.amount} (
                    {transaction.date})
                    <button
                      type="button"
                      onClick={() =>
                        this.handleDeleteTransaction(transaction.id)
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default App
