import "./actions/ftp/ftp"
import Server from "looker-action-hub/lib/server/server"
import * as dotenv from "dotenv"

dotenv.config()

Server.run()
