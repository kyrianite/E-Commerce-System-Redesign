# E-Commerce System Redesign

## About the Project
A personal practice project to update and redesign the Ratings and Reviews API of an e-commerce platform to a CRUD RESTful one that can handle 6M+ products with considerations for scalability on the cloud.

Local stress testing was conducted with K-6.

Cloud testing with Loader.io to identify and remove latency bottlenecks.

Deployed server to AWS EC2 T2 micro instances and exceeded expcected throughput 5x and latency 3x by optimizing the server utilizing horizontal scaling and optimizing server instances via caching and load balancing with NGINX

## Built With:
![PostgreSQL](https://img.shields.io/static/v1?style=for-the-badge&message=PostgreSQL&color=4169E1&logo=PostgreSQL&logoColor=FFFFFF&label=)
![NGINX](https://img.shields.io/static/v1?style=for-the-badge&message=NGINX&color=009639&logo=NGINX&logoColor=FFFFFF&label=)
![Amazon AWS](https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+AWS&color=232F3E&logo=Amazon+AWS&logoColor=FFFFFF&label=)



## Tested With:
![k6](https://img.shields.io/static/v1?style=for-the-badge&message=k6&color=7D64FF&logo=k6&logoColor=FFFFFF&label=)
![Loader.io](https://img.shields.io/static/v1?style=for-the-badge&message=Loader.io&color=02569B&logoColor=FFFFFF&label=)

## Sample Results:
<div align="center">
  <table><tr><td><img style="margin-right: 15px; margin-top: 15px;" src="public/SSK6MarkHelpfulBefore.png" alt="Sample K-6 Test Before Optimization" /></td></tr></table></br>
  <table><tr><td><img style="margin-right: 15px; margin-top: 5px;" src="public/SSK6MarkHelpfulAfter.png" alt="Sample K-6 Test After Optimization" /></td></tr></table></br>
  <table><tr><td><img style="margin-right: 15px; margin-top: 5px;" src="public/SSLoaderIOMarkHelpful.png" alt="Sample Loader.io Cloud test" /></td></tr></table>
</div>