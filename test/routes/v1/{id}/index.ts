import { RouteComponent } from "../../../../src";

export default RouteComponent.apply(
	{
		path: "params",
	},
	(res) => {
		return res.params;
	},
);
