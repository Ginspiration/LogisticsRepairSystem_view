import Vue from 'vue'


/*npm install vue-router将vue路由保存到当前开发模块（node_modules）*/
//第一步,导入
import VueRouter from "vue-router";
import WeChatPublish from "@/components/pages/WeChatPublish";
import UserStatus from "@/components/pages/UserStatus";
import Report from "@/components/pages/Report";
import RepairComplete from "@/components/pages/record/RepairComplete";
import RepairStaff from "@/components/pages/RepairStaff";
import AdminStaff from "@/components/pages/AdminStaff";
import Login from "@/components/pages/admin/Login";
import Index from "@/components/pages/admin/Index";
import Main from "@/components/Main";
import Repairing from "@/components/pages/Repairing";

Vue.use(VueRouter)//第二步,指定使用这个插件

export default new VueRouter({
    routes: [
        {path: '/', name: '登录页', component: Login},
        {path: '/Main', name: '主页面', component: Main},
        {path: '/UserStatus', name: '用户信息', component: UserStatus},
        {path: '/WeChatPublish', name: '微信发布', component: WeChatPublish},
        {path: '/Report', name: '维修上报', component: Report},
        {path: '/Repairing', name: '正在维修', component: Repairing},
        {path: '/RepairComplete', name: '已完成维修', component: RepairComplete},
        {path: '/RepairStaff', name: '维修人员信息', component: RepairStaff},
        {path: '/AdminStaff', name: '管理员信息', component: AdminStaff},
        {path: '/Login', name: '登录页', component: Login},
        {path: '/Index', name: '首页', component: Index}
    ]
})
