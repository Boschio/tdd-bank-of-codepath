import * as React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { formatAmount, formatDate } from "../../utils/format"
import "./TransactionDetail.css"
import axios from "axios";

export default function TransactionDetail() {

  const [hasFetched, setHasFetched] = useState(false)
  const [transaction, setTransaction] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  let { transactionId } = useParams()

  useEffect(() => {
    const fetchTransactionById = async () => {
      setIsLoading(true)
      setHasFetched(false)

      axios
      .get(`http://localhost:3001/bank/transactions/${transactionId}`)
      .then((res) => {
        setTransaction(res.data.transaction)
      })
      .catch((error) => {
        setError(error)
      })
      setIsLoading(false)
      setHasFetched(true)
    }
    fetchTransactionById()

  },[transactionId])

  return (
    <div className="transaction-detail">
      <TransactionCard transaction={transaction} transactionId={transactionId} />
    </div>
  )
}

export function TransactionCard({ transaction = {}, transactionId = null}) {
  console.log("TRANS-ID", transactionId)
  console.log("TRANS", transaction.id)
  
    return (
      <div className="transaction-card card">
        
        <div className="card-header">
          <h3>Transaction #{transactionId}</h3>
          {(Object.keys(transaction).length === 0) ? (<h1>Not Found</h1>) : (null)}
          <p className="category">{transaction.category}</p>
        </div>
  
        <div className="card-content">
          <p className="description">{transaction.description}</p>
        </div>
  
        <div className="card-footer">
          <p className={`amount ${transaction.amount < 0 ? "minus" : ""}`}>{formatAmount(transaction.amount)}</p>
          <p className="date">{formatDate(transaction.postedAt)}</p>
        </div>    
      </div>
    )  
  }
