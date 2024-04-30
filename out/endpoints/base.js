"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendServerError = exports.sendConflict = exports.sendNotFound = exports.sendBadRequest = exports.sendNoContent = exports.sendCreated = exports.sendOk = void 0;
function sendOk(response, data) {
    response.status(200).send(data);
}
exports.sendOk = sendOk;
function sendCreated(response) {
    response.status(201).send();
}
exports.sendCreated = sendCreated;
function sendNoContent(response) {
    response.status(204).send();
}
exports.sendNoContent = sendNoContent;
function sendError(response, code, message) {
    response.status(code).send({ status: code, message });
}
function sendBadRequest(response, message) {
    sendError(response, 400, message);
}
exports.sendBadRequest = sendBadRequest;
function sendNotFound(response, message) {
    sendError(response, 404, message);
}
exports.sendNotFound = sendNotFound;
function sendConflict(response, message) {
    sendError(response, 409, message);
}
exports.sendConflict = sendConflict;
function sendServerError(response, message) {
    sendError(response, 500, message);
}
exports.sendServerError = sendServerError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmRwb2ludHMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFtQkEsU0FBZ0IsTUFBTSxDQUFJLFFBQWtCLEVBQUUsSUFBUTtJQUNsRCxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRkQsd0JBRUM7QUFFRCxTQUFnQixXQUFXLENBQUMsUUFBa0I7SUFDMUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsUUFBa0I7SUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxRQUFrQixFQUFFLElBQVksRUFBRSxPQUFlO0lBQ2hFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRCxTQUFnQixjQUFjLENBQUMsUUFBa0IsRUFBRSxPQUFlO0lBQzlELFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFGRCx3Q0FFQztBQUVELFNBQWdCLFlBQVksQ0FBQyxRQUFrQixFQUFFLE9BQWU7SUFDNUQsU0FBUyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUZELG9DQUVDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLFFBQWtCLEVBQUUsT0FBZTtJQUM1RCxTQUFTLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRkQsb0NBRUM7QUFFRCxTQUFnQixlQUFlLENBQUMsUUFBa0IsRUFBRSxPQUFlO0lBQy9ELFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFGRCwwQ0FFQyJ9