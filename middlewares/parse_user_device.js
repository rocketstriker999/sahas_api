const { addActiveUserDevice, getActiveDevicesByUserId, userDeviceExist, addInActiveUserDevice } = require("../db/devices");
const { patchUserRecentDeviceById } = require("../db/users");

module.exports = async (req, res, next) => {
    if (req?.user && req?.device) {
        const activeUserDevices = await getActiveDevicesByUserId(req?.user?.id);

        if (!activeUserDevices?.length) {
            addActiveUserDevice(req.user.id, req?.device?.fingerPrint);
            req.device.active = true;
        } else {
            req.device.active = activeUserDevices.find((device) => req.device.fingerPrint === device.finger_print) ? true : false;

            if (!req.device.active && !(await userDeviceExist(req.user.id, req.device.fingerPrint))) {
                addInActiveUserDevice(req.user.id, req.device.fingerPrint);
            }
        }
    }

    logger.info(JSON.stringify(req?.device));
    patchUserRecentDeviceById({ id: req.user.id, device_id: req.device.id });

    next();
};
