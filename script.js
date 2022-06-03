// 获取调用链
function getStackTrace() {
    var Exception = Java.use("java.lang.Exception");
    var ins = Exception.$new("Exception");
    var straces = ins.getStackTrace();
    if (undefined == straces || null == straces) {
        return;
    }
    var result = "";
    for (var i = 0; i < straces.length; i++) {
        var str = "   " + straces[i].toString();
        result += str + "\r\n";
    }
    Exception.$dispose();
    return result;
}

//告警发送
function alertSend(key, action, messages) {
    var myDate = new Date();
    var _time = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
    action = action + " 次数:" + timeAdd(key);
    send({ "type": "notice", "time": _time, "action": action, "messages": messages, "stacks": getStackTrace() });
}


// APP申请权限
function checkRequestPermission() {
    let key = "permission";
    var ActivityCompat = Java.use("androidx.core.app.ActivityCompat")

    ActivityCompat.requestPermissions.overload('android.app.Activity', '[Ljava.lang.String;', 'int').implementation = function (p1, p2, p3) {
        var temp = this.requestPermissions(p1, p2, p3);
        alertSend(key, "APP申请权限", "申请权限为: " + p2);
        return temp

    }
}

// APP获取IMEI/IMSI
function getPhoneState() {
    let key = "phone_state";
    try {
        var TelephonyManager = Java.use("android.telephony.TelephonyManager");

        // API level 26 获取单个IMEI的方法
        TelephonyManager.getDeviceId.overload().implementation = function () {
            var temp = this.getDeviceId();
            alertSend(key, "获取IMEI", "获取的IMEI为: " + temp)
            return temp;
        };

        //API level 26 获取多个IMEI的方法
        TelephonyManager.getDeviceId.overload('int').implementation = function (p) {
            var temp = this.getDeviceId(p);
            alertSend(key, "获取IMEI", "获取(" + p + ")的IMEI为: " + temp);
            return temp;
        };

        //API LEVEL26以上的获取单个IMEI方法
        TelephonyManager.getImei.overload().implementation = function () {
            var temp = this.getImei();
            alertSend(key, "获取IMEI", "获取的IMEI为: " + temp)
            return temp;
        };

        // API LEVEL26以上的获取多个IMEI方法
        TelephonyManager.getImei.overload('int').implementation = function (p) {
            var temp = this.getImei(p);
            alertSend(key, "获取IMEI", "获取(" + p + ")的IMEI为: " + temp);
            return temp;
        };

        //imsi/iccid
        TelephonyManager.getSimSerialNumber.overload().implementation = function () {
            var temp = this.getSimSerialNumber();
            alertSend(key, "获取IMSI/iccid", "获取IMSI/iccid为(String): " + temp);
            return temp;
        };

        //imsi
        TelephonyManager.getSubscriberId.overload().implementation = function () {
            var temp = this.getSubscriberId();
            alertSend(key, "获取IMSI", "获取IMSI为(int): " + temp);
            return temp;
        }

        //imsi/iccid
        TelephonyManager.getSimSerialNumber.overload('int').implementation = function (p) {
            var temp = this.getSimSerialNumber(p);
            alertSend(key, "获取IMSI/iccid", "参数为：(" + p + "), 获取IMSI/iccid为(int): " + temp);
            return temp;
        }
    } catch (error) {
        console.log(error)
    }

}

// 获取系统属性（记录关键的）
function getSystemProperties() {
    var SystemProperties = Java.use("android.os.SystemProperties");

    let key = "SystemProperties";
    SystemProperties.get.overload('java.lang.String').implementation = function (p1) {
        var temp = this.get(p1);
        if (p1 == "ro.serialno") {
            alertSend(key, "获取设备序列号", "获取(" + p1 + ")，值为：" + temp);
        }
        if (p1 == "ro.build.display.id") {
            alertSend(key, "获取版本号", "获取(" + p1 + ")，值为：" + temp);
        }
        //MEID
        if (p1 == "ril.cdma.meid") {
            alertSend(key, "获取MEID", "获取(" + p1 + ")，值为：" + temp);
        }
        //手机型号
        if (p1 == "ro.product.model") {
            alertSend(key, "获取手机型号", "获取(" + p1 + ")，值为：" + temp);
        }
        //手机厂商
        if (p1 == "ro.product.manufacturer") {
            alertSend(key, "获取手机厂商", "获取(" + p1 + ")，值为：" + temp);
        }

        return temp;
    }

    SystemProperties.get.overload('java.lang.String', 'java.lang.String').implementation = function (p1, p2) {
        var temp = this.get(p1, p2)

        if (p1 == "ro.serialno") {
            alertSend(key, "获取设备序列号", "获取(" + p1 + " 、 " + p2 + ")，值为：" + temp);
        }
        if (p1 == "ro.build.display.id") {
            alertSend(key, "获取版本号", "获取(" + p1 + " 、 " + p2 + ")，值为：" + temp);
        }
        //MEID
        if (p1 == "ril.cdma.meid") {
            alertSend(key, "获取MEID", "获取(" + p1 + " 、 " + p2 + ")，值为：" + temp);
        }
        //手机型号
        if (p1 == "ro.product.model") {
            alertSend(key, "获取手机型号", "获取(" + p1 + " 、 " + p2 + ")，值为：" + temp);
        }
        //手机厂商
        if (p1 == "ro.product.manufacturer") {
            alertSend(key, "获取手机厂商", "获取(" + p1 + " 、 " + p2 + ")，值为：" + temp);
        }

        return temp;
    }

    SystemProperties.getInt.overload('java.lang.String', 'int').implementation = function (p1, p2) {
        var temp = this.getInt(p1, p2)

        if (p1 == "ro.build.version.sdk") {
            alertSend(key, "获取SDK版本号", "获取(" + p1 + ")，值为：" + temp);
        }

        return temp;
    }

}

//获取content敏感信息
function getContentProvider() {
    let key = "ContentProvider";
    var ContentResolver = Java.use("android.content.ContentResolver");

    // 通讯录内容
    var ContactsContract = Java.use("android.provider.ContactsContract");
    var contact_authority = ContactsContract.class.getDeclaredField("AUTHORITY").get('java.lang.Object');

    // 日历内容
    var CalendarContract = Java.use("android.provider.CalendarContract");
    var calendar_authority = CalendarContract.class.getDeclaredField("AUTHORITY").get('java.lang.Object');

    // 浏览器内容
    var BrowserContract = Java.use("android.provider.BrowserContract");
    var browser_authority = BrowserContract.class.getDeclaredField("AUTHORITY").get('java.lang.Object');

    ContentResolver.query.overload('android.net.Uri', '[Ljava.lang.String;', 'android.os.Bundle', 'android.os.CancellationSignal').implementation = function (p1, p2, p3, p4) {
        var temp = this.query(p1, p2, p3, p4);
        if (p1.toString().indexOf(contact_authority) != -1) {
            alertSend(key, "获取content敏感信息", "获取手机通信录内容");
        } else if (p1.toString().indexOf(calendar_authority) != -1) {
            alertSend(key, "获取content敏感信息", "获取日历内容");
        } else if (p1.toString().indexOf(browser_authority) != -1) {
            alertSend(key, "获取content敏感信息", "获取浏览器内容");
        } else {
            alertSend(key, "获取content敏感信息", "获取其他内容" + JSON.stringify(p1.toString()));
        }
        return temp;
    }
    ContentResolver.update.overload('android.net.Uri', 'android.content.ContentValues', 'android.os.Bundle').implementation = function (uri, cv, bundle) {
        var res = ContentResolver.update(uri, cv, bundle)
        alertSend(key, 'Update content', "Uri:" + uri)
        return res;
    }

}

// 获取安卓ID
function getAndroidId() {
    const _key = "android_id_key";
    var SettingsSecure = Java.use("android.provider.Settings$Secure");

    SettingsSecure.getString.implementation = function (p1, p2) {
        if (p2.indexOf("android_id") < 0) {
            return this.getString(p1, p2);
        }
        var temp = this.getString(p1, p2);
        alertSend(_key, "获取Android ID Secure", "参数为：" + p2 + "，获取到的ID为：" + temp);
        return temp;
    }
    var SettingSystem = Java.use("android.provider.Settings$System");
    SettingSystem.getString.implementation = function (p1, p2) {
        if (p2.indexOf("android_id") < 0) {
            return this.getString(p1, p2);
        }
        var temp = this.getString(p1, p2);
        alertSend(_key, "获取Android ID System", "参数为：" + p2 + "，获取到的ID为：" + temp);
        return temp;
    }
}
function  getInkeAtom(){
    const _key = "inke_atom_key";
    var TrackerAtomManager = Java.use("com.meelive.ingkee.tracker.TrackerAtomManager");
    TrackerAtomManager.init.implementation = function (ctx){
        alertSend(_key,"调用TrackerAtomManager.init(Context)");
        this.init(ctx);
    }
}

//获取其他app信息
function getPackageManager() {
    let key = "PackageManager";
    try {
        var PackageManager = Java.use("android.content.pm.PackageManager");
        var ApplicationPackageManager = Java.use("android.app.ApplicationPackageManager");
        var ActivityManager = Java.use("android.app.ActivityManager");

        PackageManager.getInstalledPackages.overload('int').implementation = function (p1) {
            var temp = this.getInstalledPackages(p1);
            alertSend(key, "获取其他app信息", "1获取的数据为：" + temp);
            return temp;
        };

        PackageManager.getInstalledApplications.overload('int').implementation = function (p1) {
            var temp = this.getInstalledApplications(p1);
            alertSend(key, "获取其他app信息", "getInstalledApplications获取的数据为：" + temp);
            return temp;
        };

        ApplicationPackageManager.getInstalledPackages.overload('int').implementation = function (p1) {
            var temp = this.getInstalledPackages(p1);
            alertSend(key, "获取其他app信息", "getInstalledPackages获取的数据为：" + temp);
            return temp;
        };

        ApplicationPackageManager.getInstalledApplications.overload('int').implementation = function (p1) {
            var temp = this.getInstalledApplications(p1);
            alertSend(key, "获取其他app信息", "getInstalledApplications获取的数据为：" + temp);
            return temp;
        };

        ApplicationPackageManager.queryIntentActivities.implementation = function (p1, p2) {
            var temp = this.queryIntentActivities(p1, p2);
            alertSend(key, "获取其他app信息", "参数为：" + p1 + p2 + "，queryIntentActivities获取的数据为：" + temp);
            return temp;
        };

        ApplicationPackageManager.getApplicationInfo.implementation = function (p1, p2) {
            var temp = this.getApplicationInfo(p1, p2);
            var string_to_recv;
            // 判断是否为自身应用，是的话不记录
            send({ "type": "app_name", "data": p1 });

            recv(function (received_json_object) {
                string_to_recv = received_json_object.my_data;
            }).wait();

            if (string_to_recv) {
                alertSend(key, "获取其他app信息", "getApplicationInfo获取的数据为:" + temp);
            }
            return temp;
        };

        ActivityManager.getRunningAppProcesses.implementation = function () {
            var temp = this.getRunningAppProcesses();
            alertSend(key, "获取其他app信息", "获取了正在运行的App");
            return temp;
        };
    } catch (error) {
        console.log(error)
    }
}

// 获取位置信息
function getGSP() {
    let key = "location";
    var locationManager = Java.use("android.location.LocationManager");

    locationManager.getLastKnownLocation.overload("java.lang.String").implementation = function (p1) {
        var temp = this.getLastKnownLocation(p1);
        alertSend(key, "获取位置信息", "获取上次位置信息，参数为:" + p1)
        return temp;
    }

    locationManager.requestLocationUpdates.overload("java.lang.String", "long", "float", "android.location.LocationListener").implementation = function (p1, p2, p3, p4) {
        var temp = this.requestLocationUpdates(p1, p2, p3, p4);
        alertSend(key, "获取位置信息", "更新位置信息");
        return temp;
    }

}

// 调用摄像头(hook，防止静默拍照)
function getCamera() {
    let key = "camera";
    var Camera = Java.use("android.hardware.Camera");

    Camera.open.overload("int").implementation = function (p1) {
        var temp = this.open(p1);
        alertSend(key, "调用摄像头", "调用摄像头id：" + p1.toString());
        return temp;
    }
}

//获取网络信息
function getNetwork() {
    let key = "network";
    var WifiInfo = Java.use("android.net.wifi.WifiInfo");

    //获取ip
    WifiInfo.getIpAddress.implementation = function () {
        var temp = this.getIpAddress();

        var _ip = new Array();
        _ip[0] = (temp >>> 24) >>> 0;
        _ip[1] = ((temp << 8) >>> 24) >>> 0;
        _ip[2] = (temp << 16) >>> 24;
        _ip[3] = (temp << 24) >>> 24;
        var _str = String(_ip[3]) + "." + String(_ip[2]) + "." + String(_ip[1]) + "." + String(_ip[0]);

        alertSend(key, "获取网络信息", "获取IP地址:" + _str);
        return temp;
    }
    //获取mac地址
    WifiInfo.getMacAddress.implementation = function () {
        var temp = this.getMacAddress();
        alertSend(key, "获取Mac地址", "获取到的Mac地址: " + temp);
        return temp;
    }

    WifiInfo.getSSID.implementation = function () {
        var temp = this.getSSID();
        alertSend(key, "获取wifi SSID", "获取到的SSID: " + temp);
        return temp;
    }

    WifiInfo.getBSSID.implementation = function () {
        var temp = this.getBSSID();
        alertSend(key, "获取wifi BSSID", "获取到的BSSID: " + temp);
        return temp;
    }

    var WifiManager = Java.use("android.net.wifi.WifiManager");

    // 获取wifi信息
    WifiManager.getConnectionInfo.implementation = function () {
        var temp = this.getConnectionInfo();
        alertSend(key, "获取wifi信息", "获取wifi信息");
        return temp;
    };

    var InetAddress = Java.use("java.net.InetAddress");

    //获取IP
    InetAddress.getHostAddress.implementation = function () {
        var temp = this.getHostAddress();

        alertSend(key, "获取网络信息", "获取IP地址:" + temp.toString());
        return temp;
    }

    var NetworkInterface = Java.use("java.net.NetworkInterface");

    //获取mac
    NetworkInterface.getHardwareAddress.overload().implementation = function () {
        var temp = this.getHardwareAddress();
        alertSend(key, "获取Mac地址", "获取到的Mac地址: " + temp);
        return temp;
    }

    var NetworkInfo = Java.use("android.net.NetworkInfo");

    NetworkInfo.getType.implementation = function () {
        var temp = this.getType();
        alertSend(key, "获取网络信息", "获取网络类型:" + temp.toString());
        return temp;
    }

    NetworkInfo.getTypeName.implementation = function () {
        var temp = this.getTypeName();
        alertSend(key, "获取网络信息", "获取网络类型名称:" + temp);
        return temp;
    }

    NetworkInfo.getExtraInfo.implementation = function () {
        var temp = this.getExtraInfo();
        alertSend(key, "获取网络信息", "获取网络名称:" + temp);
        return temp;
    }

    NetworkInfo.isAvailable.implementation = function () {
        var temp = this.isAvailable();
        alertSend(key, "获取网络信息", "获取网络是否可用:" + temp.toString());
        return temp;
    }

    NetworkInfo.isConnected.implementation = function () {
        var temp = this.isConnected();
        alertSend(key, "获取网络信息", "获取网络是否连接:" + temp.toString());
        return temp;
    }

}

//获取蓝牙设备信息
function getBluetooth() {
    let key = "blue_tooth";
    var BluetoothDevice = Java.use("android.bluetooth.BluetoothDevice");

    //获取蓝牙设备名称
    BluetoothDevice.getName.overload().implementation = function () {
        var temp = this.getName();
        alertSend(key, "获取蓝牙信息", "获取到的蓝牙设备名称: " + temp)
        return temp;
    }

    //获取蓝牙设备mac
    BluetoothDevice.getAddress.implementation = function () {
        var temp = this.getAddress();
        alertSend(key, "获取蓝牙信息", "获取到的蓝牙设备mac: " + temp)
        return temp;
    }

    var BluetoothAdapter = Java.use("android.bluetooth.BluetoothAdapter");

    //获取蓝牙设备名称
    BluetoothAdapter.getName.implementation = function () {
        var temp = this.getName();
        alertSend(key, "获取蓝牙信息", "获取到的蓝牙设备名称: " + temp)
        return temp;
    };


}

//获取基站信息
function getCidorLac() {
    let key = "cidor";
    // 电信卡cid lac
    var CdmaCellLocation = Java.use("android.telephony.cdma.CdmaCellLocation");

    CdmaCellLocation.getBaseStationId.implementation = function () {
        var temp = this.getBaseStationId();
        alertSend(key, "获取基站信息", "获取到的cid: " + temp);
        return temp
    }
    CdmaCellLocation.getNetworkId.implementation = function () {
        var temp = this.getNetworkId();
        alertSend(key, "获取基站信息", "获取到的lac: " + temp);
        return temp
    }

    // 移动 联通卡 cid/lac
    var GsmCellLocation = Java.use("android.telephony.gsm.GsmCellLocation");

    GsmCellLocation.getCid.implementation = function () {
        var temp = this.getCid();
        alertSend(key, "获取基站信息", "获取到的cid: " + temp);
        return temp
    }
    GsmCellLocation.getLac.implementation = function () {
        var temp = this.getLac();
        alertSend(key, "获取基站信息", "获取到的lac: " + temp);
        return temp
    }

}

// 获取短信相关信息/发送短信
function getSMSManager() {
    let key = "sms";
    try {
        var SmsManager = Java.use("android.telephony.SmsManager");

        SmsManager.sendTextMessageInternal.overload('java.lang.String', 'java.lang.String', 'java.lang.String',
            'android.app.PendingIntent', 'android.app.PendingIntent', 'boolean',
            'int', 'boolean', 'int').implementation = function (p1, p2, p3, p4, p5, p6, p7, p8, p9) {
                var temp = this.sendTextMessageInternal(p1, p2, p3, p4, p5, p6, p7, p8, p9);
                alertSend(key, "获取短信信息", "发送短信 '" + p3 + "' to '" + p1 + "'");
                return temp;
            }

        SmsManager.sendTextMessageWithSelfPermissions.implementation = function (p1, p2, p3, p4, p5, p6) {
            var temp = this.sendTextMessageWithSelfPermissions(p1, p2, p3, p4, p5, p6);
            alertSend(key, "获取短信信息", "发送短信 '" + p3 + "' to '" + p1 + "'");
            return temp;
        }

        SmsManager.sendMultipartTextMessageInternal.implementation = function (p1, p2, p3, p4, p5, p6, p7, p8, p9) {
            var temp = this.sendMultipartTextMessageInternal(p1, p2, p3, p4, p5, p6, p7, p8, p9);
            alertSend(key, "获取短信信息", "发送短信 '" + p3.toString() + "' to '" + p1 + "'");
            return temp;
        }

        SmsManager.sendDataMessage.implementation = function (p1, p2, p3, p4, p5, p6) {
            var temp = this.sendDataMessage(p1, p2, p3, p4, p5, p6);
            alertSend(key, "获取短信信息", "发送短信 '" + p4.toString() + "' to '" + p1 + "'");
            return temp;
        }

        SmsManager.sendDataMessageWithSelfPermissions.implementation = function (p1, p2, p3, p4, p5, p6) {
            var temp = this.sendDataMessageWithSelfPermissions(p1, p2, p3, p4, p5, p6);
            alertSend(key, "获取短信信息", "发送短信 '" + p4.toString() + "' to '" + p1 + "'");
            return temp;
        }
    } catch (error) {
        console.log(error)
    }


}
/**
 * // Gets a handle to the clipboard service.
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        // Creates a new text clip to put on the clipboard
        clipboard.setText("---Hello clip---");
        ClipData clip = ClipData.newPlainText("simple text", "Hello, World!");
        clipboard.setPrimaryClip(clip);
        CharSequence text = clipboard.getText();
        Toast.makeText(this, "------------clip text:" + text, Toast.LENGTH_LONG).show();
        // Examines the item on the clipboard. If getText() does not return null, the clip item contains the
        // text. Assumes that this application can only handle one item at a time.
        ClipData clipData = clipboard.getPrimaryClip();
        if (clipData != null && clipboard.hasPrimaryClip() && clipboard.getPrimaryClip().getItemCount() > 0) {
            ClipData.Item item = clipData.getItemAt(0);
            // Gets the clipboard as text.
            CharSequence pasteData = item.getText();
            Toast.makeText(this, "------------clipdata:" + pasteData, Toast.LENGTH_LONG).show();
        } else {
            Log.d("debug", "------------Empty clipdata--------------------");
            Toast.makeText(this, "------------Empty clipdata--------------------", Toast.LENGTH_LONG).show();
        }
 */

var timesMap = {};
function timeAdd(key) {
    var addTime = timesMap[key];
    if (addTime == undefined) {
        addTime = 0;
    }
    addTime++;
    timesMap[key] = addTime;
    return addTime;
}
function timeGet(key) {
    var addTime = timesMap[key];
    if (addTime == undefined) {
        addTime = 0;
    }
    return addTime;
}
function getClipboardManager() {
    let key = "ClipboardManager";
    var ClipManager = Java.use("android.content.ClipboardManager");
    ClipManager.setText.implementation = function (arg) {
        var res = this.setText(arg);
        alertSend(key, "设置剪贴板android.content.ClipboardManager", "设置txt:" + arg);
        return res;
    }
    ClipManager.setPrimaryClip.implementation = function (args) {
        var res = this.setPrimaryClip(args);
        alertSend(key, "设置剪贴板android.content.ClipboardManager", "设置txt:" + args.getItemAt(0)?.getText());
        return res;
    }
    ClipManager.getPrimaryClip.implementation = function () {
        var res = this.getPrimaryClip();
        var txt = res?.getItemAt(0)?.getText()
        alertSend(key, "读取剪贴板android.content.ClipboardManager", "读取PrimaryClip:" + txt);
        return res;
    }
    ClipManager.getText.implementation = function () {
        var txt = this.getText();
        alertSend(key, "读取剪贴板android.content.ClipboardManager", "读取txt:" + txt);
        return txt;
    }
    var TextClipboard = Java.use("android.text.ClipboardManager");
    TextClipboard.getText.implementation = function () {
        var txt = this.getText();
        alertSend(key, "读取剪贴板android.text.ClipboardManager", "读取txt:" + txt);
        return txt;
    }
}
function getFlutterPluginMethod() {
    let key = "flutter_plugin";
    var MethodCallHandler = Java.use("io.flutter.plugin.common.MethodChannel.MethodCallHandler");
    MethodCallHandler.onMethodCall.implementation = function (methodCall, result) {
        var res = this.onMethodCall(methodCall, result);
        alertSend(key, "Flutter plugin method call", "Method:" + methodCall.method);
        return res;
    }
}

function getPlatfromChannelMethod() {
    let key = "flutter_plugin";
    // try {
    //     var MethodCallHandler = Java.use("io.flutter.embedding.engine.systemchannels.PlatformChannel$1");
    //     MethodCallHandler.onMethodCall.implementation = function (methodCall, result) {
    //         var res = this.onMethodCall(methodCall, result);
    //         alertSend(key, "Flutter plugin method call", "Method:" + methodCall.name + " " + JSON.stringify(methodCall.method));
    //         return res;
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    try {
        var IncomingMethodCallHandler = Java.use("io.flutter.plugin.common.MethodChannel$IncomingMethodCallHandler");
        var JSONMethodCodec= Java.use("io.flutter.plugin.common.JSONMethodCodec");
        IncomingMethodCallHandler.onMessage.implementation = function (message, reply) {
            var res = this.onMessage(message, reply);
            var field =JSONMethodCodec.class.getDeclaredField("INSTANCE")
            // var MethodCall = JSONMethodCodec.INSTANCE.value.decodeMethodCall(message);
            alertSend(key, "Flutter plugin IncomingMethodCallHandler onMessage", "Method:");
            return res;
        }
    } catch (error) {
        console.log(error)
    }
}
function getSendBroadcastMethod() {
    let key = "send_broadcast";
    var Context = Java.use("android.content.Context");
    Context.sendBroadcast.overload("android.content.Intent").implementation = function (intent) {
        var res = Context.sendBoardcast(intent);
        alertSend(key, "Context send boardcast", "Uri:");
        return res;
    };
}
function getScanMediaMethod() {
    let key = "scan_media";
    var MediaScanner = Java.use("android.media.MediaScannerConnection");
    MediaScanner.scanFile.overload('android.content.Context', '[Ljava.lang.String;', '[Ljava.lang.String;',
        'android.media.MediaScannerConnection$OnScanCompletedListener').implementation = function (context, paths, arg3, arg4) {
            var res = MediaScanner.scanFile(context, paths, arg3, arg4);
            alertSend(key, "Scan media", "path:" + paths);
            return res;
        }
    MediaScanner.connect.implementation = function () {
        MediaScanner.connect();
        alertSend(key, "Scan media connect", "path:" + paths);
    };
    const _env_key = "Environment";
    var Environment = Java.use("android.os.Environment");
    Environment.getExternalStorageDirectory.implementation = function () {
        var res = Environment.getExternalStorageDirectory();
        alertSend(_env_key, "Read ExternalStorage", "path:" + res);
        return res;
    }
    Environment.getExternalStoragePublicDirectory.implementation = function (rootDir) {
        var res = Environment.getExternalStoragePublicDirectory(rootDir);
        alertSend(_env_key, "Read ExternalPubStorage", "rootDir:" + rootDir);
        return res;
    }
    Environment.getDataDirectory.overload.implementation = function () {
        var res = Environment.getDataDirectory();
        alertSend(_env_key, "Read Data Storage", "");
        return res;
    }
    Environment.getDownloadCacheDirectory.implementation = function () {
        var res = Environment.getDownloadCacheDirectory();
        alertSend(_env_key, "Read Download Cache Storage", "");
        return res;
    }
    // var ProviderMedia = Java.use("android.provider.MediaStore.Images.Media");
    // ProviderMedia.getContentUri.implementation = function (volumeName) {
    //     var res = ProviderMedia.getContentUri(volumeName);
    //     alertSend(key, "ProviderMedia scan", "volumeName:" + volumeName + " Uri:" + res);
    //     return res;
    // }
}
function main() {
    Java.perform(function () {
        console.log("合规检测敏感接口开始监控...");
        send({ "type": "isHook" })
        // checkRequestPermission();
        getPhoneState();
        // getSystemProperties();
        getContentProvider();
        getAndroidId();
        // getPackageManager();
        // getGSP();
        // getCamera();
        // getNetwork();
        // getBluetooth();
        // getCidorLac();
        // getSMSManager();
        getClipboardManager();
        // getPlatfromChannelMethod();
        // getSendBroadcastMethod();
        // getScanMediaMethod();
        getInkeAtom();
    });
}

//在spawn模式下，hook系统API时如javax.crypto.Cipher建议使用setImmediate立即执行，不需要延时
//在spawn模式下，hook应用自己的函数或含壳时，建议使用setTimeout并给出适当的延时(500~5000)

// main();
//setImmediate(main)
// setTimeout(main, 3000);
