function Terms() {
    return (
        <div className="terms-container">
            <h2>Terms & Conditions</h2>
            
            <section>
                <h3>1. Auction Participation</h3>
                <p>
                    By placing a bid, you enter into a legally binding contract to purchase the vehicle 
                    if you are the winning bidder. All bids are final and cannot be retracted.
                </p>
            </section>

            <section>
                <h3>2. Vehicle Condition</h3>
                <p>
                    All vehicles are sold "as-is" without warranty. We strongly recommend inspecting 
                    vehicles in person or through a third-party inspection service prior to bidding.
                </p>
            </section>

            <section>
                <h3>3. Buyer's Responsibility</h3>
                <p>
                    Winning bidders must complete payment within 24 hours of auction close. Failure to pay 
                    will result in forfeiture of any deposit and possible suspension from future auctions.
                </p>
            </section>

            <section>
                <h3>4. Fees and Taxes</h3>
                <p>
                    All applicable fees, taxes, and registration costs are the sole responsibility 
                    of the buyer and are not included in the hammer price.
                </p>
            </section>

            <section>
                <h3>5. Prohibited Activities</h3>
                <p>
                    Shill bidding, bid manipulation, or any form of fraudulent activity is strictly 
                    prohibited and will result in immediate account termination.
                </p>
            </section>

            <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
    );
};



export default Terms;