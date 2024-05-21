<template>
  <div>
      <vue-office-pdf style="height: 100vh;" :src="url"/>
  </div>
    </template>
     
    <script>
    import VueOfficeDocx from '@vue-office/docx'
    import '@vue-office/docx/lib/index.css'
    import VueOfficeExcel from '@vue-office/excel'
    import '@vue-office/excel/lib/index.css'
    import VueOfficePdf from '@vue-office/pdf'
    import { getRequest, postRequest } from "@/api/user";
    export default {
      components:{
        VueOfficePdf
      },
      data(){
        return {
          url: '/static/software4intro.pdf', //设置文档网络地址，可以是相对地址
        }
      },
      created(){
        // getRequest("/file/getIntroFile").then((res) => {
        //   this.url = res
        // });
      }
    }
    </script>