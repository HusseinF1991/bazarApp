import { Badge, Tooltip } from "antd";
import back_direction from "../../../images/back_direction.png";
import GoogleMapReact from "google-map-react";

function CustomerLocOnMap(props) {
  const defaultProps = {
    center: {
      lat: props.customerInfo.lat,
      lng: props.customerInfo.lng,
    },
    zoom: 11,
  };

  const AnyReactComponent = ({ text }) => <Badge color={"red"} text={text} />;

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div
        className="m-auto h-5/6 w-8/12 bg-slate-800 mt-8 p-4"
        style={{ overflowY: "auto" }}
      >
        <div className="flex justify-end mb-2">
          <Tooltip placement="right" title={"رجوع"}>
            <img
              src={back_direction}
              alt="back_direction"
              style={{ width: "35px", cursor: "pointer" }}
              className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
              onClick={() => {
                // props.setLoadItems(true);
                props.setDisplayCustomerLocOnMap(false);
              }}
            ></img>
          </Tooltip>
        </div>
        <div style={{ height: "500px", width: "900px" }}>
          <GoogleMapReact
            //   bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent
              lat={props.customerInfo.lat}
              lng={props.customerInfo.lng}
              text={props.customerInfo.name}
            />
          </GoogleMapReact>
        </div>
      </div>
    </div>
  );
}

export default CustomerLocOnMap;
