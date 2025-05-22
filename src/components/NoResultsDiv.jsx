const NoResultsDiv = () => {
  return (
    <div className="no-results">
      <img src="icons/no-result.svg" alt="No results found" className="icon" />
      <h3 className="title">Oops! Something went wrong</h3>
      <p className="message">
        We couldn't retrieve the weather details for your location. Please ensure you've entered a valid city name or try again later.
      </p>
      <button className="retry-button" onClick={() => window.location.reload()}>
        <span className="material-symbols-rounded">refresh</span>
        Try Again
      </button>
    </div>
  );
};

export default NoResultsDiv;