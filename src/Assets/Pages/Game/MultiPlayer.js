import { React, useEffect, useState } from "react";
import { Row, Container, Col, Button, Image } from "react-bootstrap";
import { images } from "../../../Images";
import Playpopup from "../../Components/Playpopup";
import Menupopup from "../../Components/Menupopup";
import Form from "react-bootstrap/Form";
import "../../Css/Game/MultiPlayer.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import {
  BuyCoin,
  GetAllCoin,
  GetSingleGame,
  BorrowAmount,
  SellCoin,
  UpdateCoin,
  clearErrors,
  clearMessages,
} from "../../../store/actions";
import { Puff } from "react-loader-spinner";
import { toast } from "react-hot-toast";

const Play = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonPopupEx, setButtonPopupEx] = useState(false);
  const [buttonPopupBor, setButtonPopupBor] = useState(false);
  const [buttonPopupMen, setButtonPopupMen] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    singleGameData,
    loading,
    coin,
    errors: error,
    message,
    sessionExpireError,
    buyLoading,
    sellLoading,
    updateLoading,
  } = useSelector((s) => s.clubReducer);
  const navigate = useNavigate();

  const [buySellValue, setBuySellValue] = useState(1);
  const [goingtoUpdateValue, setGoingtoUpdateValue] = useState(1);
  const [goingtoUpdatePortfolioId, setGoingtoUpdatePortfolioId] = useState("");
  // console.log("singleGameData is", singleGameData);
  const userId = JSON.parse(sessionStorage.getItem("user") ?? "{}").id;

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (sessionExpireError !== "") {
      toast.error(sessionExpireError);
      dispatch(clearErrors());
      setTimeout(() => navigate("/"), 1000);
    }
    if (message !== "") {
      toast.success(message);
      dispatch(clearMessages());
      setButtonPopupEx(false);
      setButtonPopup(false);
      setButtonPopupBor(false);
    }
  }, [error, sessionExpireError, message]);

  // buy sell
  const handlePopup = (clickedUserId) => {
    if (clickedUserId !== userId) return;
    setButtonPopupEx(true);
  };

  const handleBuy = () => {
    dispatch(
      BuyCoin({
        id: id,
        portfolio: singleGameData?.rivalProtfolios?.find(
          (r) => r?.user?.id === userId
        )?._id,
        quantity: buySellValue,
      })
    );
  };
  const handleSell = () => {
    dispatch(
      SellCoin({
        id: id,
        portfolio: singleGameData?.rivalProtfolios?.find(
          (r) => r?.user?.id === userId
        )?._id,
        quantity: buySellValue,
      })
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (
        singleGameData?.challenger === null ||
        !singleGameData?.rival === null
      ) {
        navigate("/profile");
      }
    }, 2000);
  }, []);

  useEffect(() => {
    dispatch(GetAllCoin());
  }, [dispatch]);

  // GetSingleGame
  useEffect(() => {
    if (id) {
      dispatch(
        GetSingleGame(id, null, () => {
          navigate("/profile", { replace: true });
        })
      );
    } else {
      navigate("/profile", { replace: true });
    }
  }, [dispatch, id, navigate]);

  const handlePercentageDiv = (clickedUserId) => {
    console.log(clickedUserId, userId);
    if (clickedUserId !== userId) return;
    setButtonPopup(true);
  };

  const handleUpdate = () => {
    dispatch(
      UpdateCoin({
        id: id,
        currentPortfolio: singleGameData?.rivalProtfolios?.find(
          (r) => r?.user?.id === userId
        )?._id,
        newPortfolio: goingtoUpdatePortfolioId,
        quantity: goingtoUpdateValue,
      })
    );
  };
  const user = JSON.parse(sessionStorage.getItem("user"));
  const handleBorrow = () => {
    if (!borrowAmount) {
      return toast.error("Amount is required");
    } else {
      let result = {
        id: singleGameData?.id,
        portfolio:
          singleGameData?.challenger?.email === user?.email
            ? singleGameData?.challengerProtfolios[0]?.portfolio?.id
            : singleGameData?.rivalProtfolios[0]?.portfolio?.id,
        amount: Number(borrowAmount),
        player:
          singleGameData?.challenger?.email === user?.email
            ? "challenger"
            : "rival",
      };
      dispatch(BorrowAmount(result));
      setBorrowAmount("");
    }
  };

  return loading ? (
    <div className="loader">
      <Puff
        height="60"
        width="60"
        radius="6"
        color="white"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    </div>
  ) : (
    <div className="playbackgroundimag">
      <Container>
        <Row className="addspaceforplayfirstrow">
          <Col md={1}>
            <Button
              className="hamburgontopgame"
              onClick={() => setButtonPopupMen(true)}
            >
              <GiHamburgerMenu />
            </Button>
            <Menupopup trigger={buttonPopupMen} setTrigger={setButtonPopupMen}>
              <p className="menuheadpop">MENU</p>
              <div className="makemenuitemsinrow">
                <Link className="menuitempopup">Resume Game</Link>
                <Link className="menuitempopup">General Settings</Link>
                <Link className="menuitempopup">Exit Game</Link>
              </div>
            </Menupopup>
          </Col>
          <Col md={9}></Col>
          <Col md={2}>
            <p className="upperheadingstopright">Total Portfolio</p>
            <p className="upperheadingstopright">Change: <span className="upperheadtoprightvalue">(+2.5% or -3.8%)</span></p>
            <p className="upperheadingstopright">Current Balance: <span className="upperheadtoprightvalue">$5000</span></p>
            <p className="upperheadingstopright">Borrowing Rate: <span className="upperheadtoprightvalue"> 5%</span></p>
            <p className="upperheadingstopright">Borrowing Interest: <span className="upperheadtoprightvalue">-$100</span></p>
            <Button
              className="rightsideborrowbtn"
              onClick={() => setButtonPopupBor(true)}
            >
              Borrow
            </Button>
            <p className="upperheadingstopright mt-3">Manage Assets</p>
            <p className="manageassetsdesc">Click to buy or sell this asset</p>
            <Menupopup trigger={buttonPopupBor} setTrigger={setButtonPopupBor}>
              <p className="menuheadpop">Borrow Amount</p>
              {/* <p className="alreadyborrow mt-3">
                Already Borrowed : <span className="borrowvalue">$300</span>
              </p> */}
              <Form>
                <Form.Group>
                  <Form.Label className="selectamountlablel">
                    Enter amount to borrow
                  </Form.Label>
                  <Form.Control
                    className="exchangepopuptextfield"
                    type="number"
                    placeholder="Enter Amount"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                  />
                </Form.Group>
                <div className="setbuttonpositionforplaypopup">
                  <Button
                    className="exchangepopbuy mt-3"
                    onClick={() => handleBorrow()}
                    disabled={loading ? true : false}
                  >
                    {loading ? "Please wait..." : "Borrow"}
                  </Button>
                </div>
              </Form>
            </Menupopup>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            {singleGameData?.rivalProtfolios?.length > 0 &&
              singleGameData.rivalProtfolios.map((data, ind) => {
                return (
                  <Button
                    className="leftplaybuttonhover"
                    onClick={() => handlePopup(data?.user?.id)}
                    key={ind}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <Image
                      crossOrigin="true"
                      height={"25%"}
                      width={"25%"}
                      src={
                        data?.portfolio?.coin?.photoPath &&
                        data.portfolio.coin.photoPath
                      }
                    />
                    <p className="playrank">
                      {data?.portfolio?.coin?.quote?.USD?.price &&
                        parseFloat(data.portfolio.coin.quote.USD.price).toFixed(
                          2
                        )}{" "}
                      %
                    </p>
                  </Button>
                );
              })}
          </Col>

          <Col md={3}></Col>
          <Col md={2}>
            <div className="hover-text">
              <span class="tooltip-text" id="bottom">
                <ul>
                  <li>Goals are awarded based on your portfolio's performance compared to your opponent's portfolio.</li>
                  <li>Whenever you change your digital assets (buy/sell) the game checks both players' portfolio performance, and whoever perform better get a goal</li>
                  <li>Additionally, after 24 hours for idle game modes, the game evaluates both players' portfolio performance again, and the one with better performance scores a goal.</li>
                  <li>Strive for better portato performance to increase your chances of scoring more goals and outperforming your opponent!</li>
                </ul>
              </span>
              <div className="maketimeinrowplayground">
                <div className="tmplayground">
                  <p className="timetextplayground">
                    {" "}
                    {singleGameData?.rivalClub?.symbol &&
                      singleGameData.rivalClub?.symbol}
                  </p>
                </div>
                <div className="zhplayground">
                  <p className="timetextplayground">
                    {" "}
                    {singleGameData?.challengerClub &&
                      singleGameData.challengerClub?.symbol}
                  </p>
                </div>
              </div>
              <div className="maketimeinrowplayground">
                <div className="timehour">
                  <p className="hourplayground">
                    {" "}
                    {singleGameData?.rivalGoals && singleGameData.rivalGoals}
                  </p>
                </div>
                <div className="timehour">
                  <p className="hourplayground">
                    {singleGameData?.challengerGoals &&
                      singleGameData.challengerGoals}
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={3}></Col>
          <Col md={2}>
            {singleGameData?.challengerProtfolios?.length > 0 &&
              singleGameData.challengerProtfolios.map((data, ind) => {
                return (
                  <Button
                    className="leftplaybuttonhover"
                    onClick={() => handlePopup(data?.user?.id)}
                    key={ind}
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <p className="playrankwhite">
                      $
                      {data?.portfolio?.coin?.quote?.USD?.price &&
                        parseFloat(
                          data.portfolio.coin.quote.USD.price * data?.quantity
                        ).toFixed(2)}
                    </p>
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        data?.portfolio?.coin?.photoPath &&
                        data.portfolio.coin.photoPath
                      }
                    />
                  </Button>
                );
              })}
          </Col>
        </Row>
        <Playpopup
          trigger={buttonPopupEx}
          setTrigger={setButtonPopupEx}
          disabled={buyLoading || sellLoading}
        >
          <Form>
            <Form.Group>
              <p className="selectamountlablel mt-4">
                Balance is
                <span style={{ color: "green" }}>
                  {" "}
                  $
                  {singleGameData?.rivalBalance
                    ? parseFloat(singleGameData.rivalBalance).toFixed(2)
                    : 0}
                </span>
              </p>
              <p className="selectamountlablel mt-4">
                Coin Price is{" "}
                <span style={{ color: "green" }}>
                  $
                  {parseFloat(
                    [
                      ...(singleGameData?.rivalProtfolios ?? []),
                      ...(singleGameData?.challengerProtfolios ?? []),
                    ].find((p) => p?.user?.id === userId)?.portfolio?.coin
                      ?.quote?.USD?.price ?? 0
                  ).toFixed(2)}
                </span>
              </p>
              <p className="selectamountlablel mt-4">
                Amount is{" "}
                <span style={{ color: "red" }}>
                  $
                  {parseFloat(
                    [
                      ...(singleGameData?.rivalProtfolios ?? []),
                      ...(singleGameData?.challengerProtfolios ?? []),
                    ].find((p) => p?.user?.id === userId)?.portfolio?.coin
                      ?.quote?.USD?.price ?? 0
                  ).toFixed(2) * buySellValue}
                </span>
              </p>

              <Form.Label className="selectamountlablel">
                Selected Coin is{" "}
                <img
                  width={"20%"}
                  height={"20%"}
                  src={
                    [
                      ...(singleGameData?.rivalProtfolios ?? []),
                      ...(singleGameData?.challengerProtfolios ?? []),
                    ].find((p) => p?.user?.id === userId)?.portfolio?.coin
                      ?.photoPath ?? ""
                  }
                  alt="selectedCoin"
                />
              </Form.Label>
              <Form.Control
                className="exchangepopuptextfield"
                type="number"
                placeholder="Enter Amount"
                value={buySellValue}
                onChange={(e) => setBuySellValue(e.target.value)}
              />
            </Form.Group>
            <div className="setbuttonpositionforplaypopup">
              <Button
                className="exchangepopbuy mt-3"
                onClick={handleBuy}
                disabled={buyLoading}
              >
                {buyLoading ? "Loading..." : "Buy"}
              </Button>
              <Button
                className="exchangepopsell mt-3"
                onClick={handleSell}
                disabled={sellLoading}
              >
                {sellLoading ? "Loading..." : "Sell"}
              </Button>
            </div>
          </Form>
        </Playpopup>
        <Row className="margsettomakeinline">
          {/* rival 0 */}
          <Col md={1} className="removepaddfrombtn margletbtnsetplayinrow">
            {singleGameData.rivalProtfolios &&
              singleGameData.rivalProtfolios[0] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.rivalProtfolios?.length > 0 &&
                      singleGameData.rivalProtfolios[0]?.portfolio?.user?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playertwo} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbttwo}
                                        />
                                        <p className="playrankformen m-1">
                                            1.100 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.rivalProtfolios?.length > 0 &&
                        singleGameData.rivalProtfolios[0]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[0]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[0]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          {/* rival 1 */}
          <Col md={1} className="removepaddfrombtn marginsetforbuttontwoinrow">
            {singleGameData.rivalProtfolios &&
              singleGameData.rivalProtfolios[1] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.rivalProtfolios?.length > 0 &&
                      singleGameData.rivalProtfolios[1]?.portfolio?.user?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerfive} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtthree}
                                        />
                                        <p className="playrankredformen m-1">
                                            {" "}
                                            0.3 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.rivalProtfolios?.length > 0 &&
                        singleGameData.rivalProtfolios[1]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[1]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {" "}
                      {singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[1]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          <Col md={2}></Col>
          {/* rival 3 */}
          <Col md={1} className="removepaddfrombtn margsetforthirdinrow">
            {singleGameData.rivalProtfolios &&
              singleGameData.rivalProtfolios[3] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.rivalProtfolios?.length > 0 &&
                      singleGameData.rivalProtfolios[3]?.portfolio?.user?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerthree} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtfour}
                                        />
                                        <p className="playrankredformen m-1">
                                            {" "}
                                            1.00 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.rivalProtfolios?.length > 0 &&
                        singleGameData.rivalProtfolios[3]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[3]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {" "}
                      {singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[3]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          <Col md={2}></Col>
          {/* challenger 3 */}
          <Col md={1} className="removepaddfrombtn marginsetforfourthbutinrow">
            {singleGameData.challengerProtfolios &&
              singleGameData.challengerProtfolios[3] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.challengerProtfolios?.length > 0 &&
                      singleGameData.challengerProtfolios[3]?.portfolio?.user
                        ?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerfive} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtone}
                                        />
                                        <p className="playrankformen m-1">
                                            12
                                            %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.challengerProtfolios?.length > 0 &&
                        singleGameData.challengerProtfolios[3]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[3]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[3]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          <Col md={2}></Col>
          {/* challenger 1 */}
          <Col md={1} className="removepaddfrombtn marginsetforfifthhbutinrow">
            {singleGameData.challengerProtfolios &&
              singleGameData.challengerProtfolios[1] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.challengerProtfolios?.length > 0 &&
                      singleGameData.challengerProtfolios[1]?.portfolio?.user
                        ?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerfive} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtone}
                                        />
                                        <p className="playrankformen m-1">
                                            {" "}
                                            11.00 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.challengerProtfolios?.length > 0 &&
                        singleGameData.challengerProtfolios[1]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[1]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[1]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>

          {/* challenger 0 */}
          <Col md={1} className="removepaddfrombtn margsetforsixthinrow">
            {singleGameData.challengerProtfolios &&
              singleGameData.challengerProtfolios[0] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.challengerProtfolios?.length > 0 &&
                      singleGameData.challengerProtfolios[0]?.portfolio?.user
                        ?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playertwo} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtfour}
                                        />
                                        <p className="playrankredformen m-1">
                                            {" "}
                                            20 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.challengerProtfolios?.length > 0 &&
                        singleGameData.challengerProtfolios[0]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[0]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[0]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
        </Row>

        <Row className="mt-0">
          <Col md={1}></Col>
          {/* rival 2 */}
          <Col md={1} className="removepaddfrombtn margsetforsevinrowtwo">
            {singleGameData.rivalProtfolios &&
              singleGameData.rivalProtfolios[2] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.rivalProtfolios?.length > 0 &&
                      singleGameData.rivalProtfolios[2]?.portfolio?.user?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerfive} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtone}
                                        />
                                        <p className="playrankformen m-1">
                                            {" "}
                                            13.00 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.rivalProtfolios?.length > 0 &&
                        singleGameData.rivalProtfolios[2]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[2]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[2]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          <Col md={2}></Col>
          {/* rival 4 */}
          <Col md={1} className="removepaddfrombtn margsetforeighthinrowtwo">
            {singleGameData.rivalProtfolios &&
              singleGameData.rivalProtfolios[4] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.rivalProtfolios?.length > 0 &&
                      singleGameData.rivalProtfolios[4]?.portfolio?.user?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerfive} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtone}
                                        />
                                        <p className="playrankformen m-1">
                                            {" "}
                                            13.00 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.rivalProtfolios?.length > 0 &&
                        singleGameData.rivalProtfolios[4]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[4]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.rivalProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.rivalProtfolios[4]?.portfolio?.coin
                            ?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          <Col md={3}></Col>
          {/* challenger 4 */}
          <Col md={1} className="removepaddfrombtn margsetforninthinrowtwo">
            {singleGameData.challengerProtfolios &&
              singleGameData.challengerProtfolios[4] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.challengerProtfolios?.length > 0 &&
                      singleGameData.challengerProtfolios[4]?.portfolio?.user
                        ?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playertwo} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={images.playbtone}
                                        />
                                        <p className="playrankredformen m-1">
                                            {" "}
                                            13.00 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.challengerProtfolios?.length > 0 &&
                        singleGameData.challengerProtfolios[4]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[4]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[4]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
          <Col md={2}></Col>
          {/* chanllenge - 2*/}
          <Col md={1} className="removepaddfrombtn margsetforlastoneinrow">
            {singleGameData.challengerProtfolios &&
              singleGameData.challengerProtfolios[2] && (
                <Button
                  className="playerclickpopupbutton"
                  onClick={() =>
                    handlePercentageDiv(
                      singleGameData?.challengerProtfolios?.length > 0 &&
                      singleGameData.challengerProtfolios[2]?.portfolio?.user
                        ?.id
                    )
                  }
                >
                  <div className="playerimagedivplay">
                    <Image src={images.playerfive} width="55%" />
                  </div>
                  {/* <div className="maketheminrowatbottomfield">
                                        <Image
                                            crossOrigin="true"
                                            height={"30%"}
                                            width={"30%"}
                                            src={
                                                singleGameData
                                                    ?.challengerProtfolios
                                                    ?.length > 0 &&
                                                singleGameData
                                                    .challengerProtfolios[2]
                                                    ?.portfolio?.coin?.photoPath
                                            }
                                        />
                                        <p className="playrankformen m-1">
                                            5 %
                                        </p>
                                    </div> */}
                  <div className="maketheminrowatbottomfieldsecond margtopicobgplay">
                    <Image
                      crossOrigin="true"
                      height={"30%"}
                      width={"30%"}
                      src={
                        singleGameData?.challengerProtfolios?.length > 0 &&
                        singleGameData.challengerProtfolios[2]?.portfolio?.coin
                          ?.photoPath
                      }
                    />
                    <p
                      className={`iunderhead ${singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[2]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2) >= 0
                        ? "green"
                        : "red"
                        }`}
                    >
                      {singleGameData?.challengerProtfolios?.length > 0 &&
                        parseFloat(
                          singleGameData.challengerProtfolios[2]?.portfolio
                            ?.coin?.quote?.USD?.percent_change_24h
                        ).toFixed(2)}
                      %
                    </p>
                  </div>
                </Button>
              )}
          </Col>
        </Row>

        <Playpopup
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
          disabled={updateLoading}
        >
          <Form onSubmit={handleUpdate}>
            <p className="selectamountlablel mt-4">
              Balance is{" "}
              <span style={{ color: "green" }}>
                $
                {singleGameData?.rivalBalance
                  ? parseFloat(singleGameData.rivalBalance).toFixed(2)
                  : 0}
              </span>
            </p>
            <p className="selectamountlablel mt-4">
              Coin Price is{" "}
              <span style={{ color: "green" }}>
                $
                {parseFloat(
                  [
                    ...(singleGameData?.rivalProtfolios ?? []),
                    ...(singleGameData?.challengerProtfolios ?? []),
                  ].find((p) => p?.user?.id === userId)?.portfolio?.coin?.quote
                    ?.USD?.price ?? 0
                ).toFixed(2)}
              </span>
            </p>
            <p className="selectamountlablel mt-4">
              Amount is{" "}
              <span style={{ color: "green" }}>
                $
                {parseFloat(
                  [
                    ...(singleGameData?.rivalProtfolios ?? []),
                    ...(singleGameData?.challengerProtfolios ?? []),
                  ].find((p) => p?.user?.id === userId)?.portfolio?.coin?.quote
                    ?.USD?.price ?? 0
                ).toFixed(2) * goingtoUpdateValue}
              </span>
            </p>

            {/* <p className="selectamountlablel mt-4">
                            Select Coin Price is according to Quantity{" "}
                            <span style={{ color: "red" }}>
                                {parseFloat(99).toFixed(2) * 2}
                            </span>
                        </p> */}
            <Form.Group>
              <Form.Label className="selectamountlablel mt-4">
                Select a coin type for each football player
              </Form.Label>
              <Form.Select
                className="selectcoinselect"
                aria-label="Select coin"
                required
                value={goingtoUpdatePortfolioId}
                onChange={(e) => setGoingtoUpdatePortfolioId(e.target.value)}
              >
                <option id="" disabled>
                  Select any coin
                </option>
                {coin.map((c, i) => (
                  <option value={c?._id} key={i}>
                    {c?.name} ( ${parseFloat(c?.quote?.USD?.price).toFixed(2)} )
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                className="exchangepopuptextfield"
                type="number"
                placeholder="Enter Quantity"
                value={goingtoUpdateValue}
                onChange={(e) => setGoingtoUpdateValue(e.target.value)}
              />
            </Form.Group>
            <div className="setbuttonpositionforplaypopup">
              <Button
                className="selecttokentoexchangeformbytton mt-3"
                type="submit"
                disabled={updateLoading}
              >
                {updateLoading ? "Loading..." : "Update"}
              </Button>
            </div>
          </Form>
        </Playpopup>
      </Container>
    </div>
  );
};

export default Play;
