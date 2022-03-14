import logo from './logo.svg';
import './App.css';
import React from 'react';
import {CSVLink} from 'react-csv';

const headers_csv = [
	{ label: "Name", key: "name" },
	{ label: "Price, $", key: "current_price" },
	{ label: "24h, %", key: "price_change_percentage_24h" },
	{ label: "Market cap", key: "market_cap" }
];

class App extends React.Component {	
	constructor(props) {
		super(props);
		
		this.state = {
			items: [],
			DataisLoaded: false
		};
		
		this.myRef = React.createRef();
		this.updateCrypto = this.updateCrypto.bind(this);
	}
	
	updateCrypto() {
		const node = this.myRef.current;
		
			fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
				.then(response => response.json())
				.then(data => {
					this.setState({
						items: data,
						DataisLoaded: true
					});
					
					[].forEach.call(node.childNodes, element => {
						var getCrypto = data.find(item => item.id === element.id);
						if (getCrypto) {
							element.childNodes[1].innerHTML = "$" + getCrypto.current_price;
							
							element.childNodes[2].innerHTML = getCrypto.price_change_percentage_24h.toFixed(2) + "%";
							element.childNodes[2].className = (getCrypto.price_change_percentage_24h >= 0 ? "positive" : "negative") + "-percentage";
							
							element.childNodes[3].innerHTML = "$" + (getCrypto.market_cap / 1000000).toFixed(2) + "M";
						}
					});
				});
	}
	
	componentDidMount() {
		fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					items: data,
					DataisLoaded: true
				});
			})
	}
	
	render() {
		const {DataisLoaded, items} = this.state;
		if (!DataisLoaded) return <div><h1>Wait...</h1></div>;
		
		return (
			<div className="App">
				<h1>CryptoTestApp</h1>
				<div>Data from <a href="https://www.coingecko.com/">CoinGecko</a></div>
				
				<p>
					<button id="update_button" onClick={this.updateCrypto}>Update</button>
					<CSVLink
						data={this.state.items}
						headers={headers_csv}
						filename={"CryptoTestApp.csv"}
						separator={";"}
					>Save to CSV</CSVLink>
				</p>
				
				<table id="crypto_table">
					<thead>
						<tr>
							<td>Name</td>
							<td>Price</td>
							<td>24h</td>
							<td>Market cap</td>
						</tr>
					</thead>
					<tbody ref={this.myRef}>
						{
							items.map((item) => (
								<tr key = {item.id} id = {item.id}>
									<td>{item.name}<br/>{"(" + item.symbol + ")"}</td>
									<td>${item.current_price}</td>
									<td className={(item.price_change_percentage_24h >= 0 ? "positive" : "negative") + "-percentage"}>{item.price_change_percentage_24h.toFixed(2)}%</td>
									<td>${(item.market_cap / 1000000).toFixed(2) + "M"}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		);
	}
}

export default App;
