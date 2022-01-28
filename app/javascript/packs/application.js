// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// bootstrap追加
import "bootstrap";

// css読み込み
import "../stylesheets/application.scss";
import "../stylesheets/common.scss";

// js commonフォルダ読み込み
// import "./common/config"
// import "./common/components"
// import "./common/mainscene"
// import "./common/titlescene"

Rails.start()
Turbolinks.start()
ActiveStorage.start()
