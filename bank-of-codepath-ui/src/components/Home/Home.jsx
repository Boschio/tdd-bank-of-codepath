import * as React from "react"
import AddTransaction from "../AddTransaction/AddTransaction"
import BankActivity from "../BankActivity/BankActivity"
import "./Home.css"
import { useEffect } from "react"
import axios from "axios";

export default function Home(props) {

  useEffect(() => {
    props.setIsLoading(true)
    const fetchData = () => {
      axios
      .get("http://localhost:3001/bank/transactions")
      .then((res) => {
        props.setTransactions(res.data.transactions)
      })
      .catch((error) => {
        props.setError(error)
      })

      axios
      .get("http://localhost:3001/bank/transfers")
      .then((res) => {
        props.setTransfers(res.data.transfers)
      })
      .catch((error) => {
        props.setError(error)
      })
    }
    fetchData()
    props.setIsLoading(false)
  },[])

  let filteredTransactions = []

  if (props.filterInputValue) {
    filteredTransactions = props.transactions.filter(transaction => {
      return(transaction.description.toLowerCase().includes(props.filterInputValue.toLowerCase()))
    })
  } else {
    filteredTransactions = props.transactions
  }

  const handleOnSubmitNewTransaction = async () => {
    props.setIsCreating(true)
    await axios.post('http://localhost:3001/bank/transactions', {transaction: props.newTransactionForm})
    .then(
      response => {props.setTransactions(stuff => [...stuff, response.data.transaction])
      props.setNewTransactionForm({category: "",description: "",amount: 0,})
      props.setIsCreating(false)}
    )
    .catch(error => {
      props.setError(error)
      props.setIsCreating(false)
    })
  }

  return (
    <div className="home">
      <AddTransaction isCreating={props.isCreating} setIsCreating={props.setIsCreating} 
      form={props.newTransactionForm} setForm={props.setNewTransactionForm}
      handleOnSubmit={handleOnSubmitNewTransaction} />
      {props.isLoading ? <h1 className="loading">Loading...</h1> : <BankActivity transactions={filteredTransactions} />}
      {props.error ? <h2 className="error">{props.error}</h2> : ""}
    </div>
  )
}
